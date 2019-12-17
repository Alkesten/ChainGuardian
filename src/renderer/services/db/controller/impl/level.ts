/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * @module db/controller/impl
 */

import {LevelUp} from "levelup";
import {IDatabaseController, ISearchOptions} from "../interface";
import {EventEmitter} from "events";
// @ts-ignore
import level from "level";
import {IDatabaseOptions} from "../../options";
import * as fs from "fs";
import {warn} from "electron-log";

export interface ILevelDBOptions extends IDatabaseOptions {
    db?: LevelUp;
}

/**
 * The LevelDB implementation of DB
 */
export class LevelDbController extends EventEmitter implements IDatabaseController {
    private db!: LevelUp;

    private opts: ILevelDBOptions;

    public constructor(opts: ILevelDBOptions) {
        super();
        this.opts = opts;
    }

    public async start(): Promise<void> {
        if(!this.db) {
            this.db = this.opts.db 
                || level(this.getDatabaseLocation(), {keyEncoding: "binary", valueEncoding: "binary"});
        } else {
            await this.db.open();
        }

    }

    public async stop(): Promise<void> {
        await this.db.close();
    }

    public async get(key: any): Promise<Buffer | null> {
        try {
            return await this.db.get(key);
        } catch (e) {
            if (e.notFound) {
                return null;
            }
            throw e;
        }
    }

    public put(key: any, value: any): Promise<any> {
        return this.db.put(key, value);
    }

    public async batchPut(items: { key: any; value: any }[]): Promise<any> {
        const batch = this.db.batch();
        items.forEach(item => batch.put(item.key, item.value));
        await batch.write();
    }

    public async batchDelete(items: any[]): Promise<any> {
        const batch = this.db.batch();
        items.forEach(item => batch.del(item));
        await batch.write();
    }

    public async delete(key: any): Promise<void> {
        await this.db.del(key);
    }

    public search(opts: ISearchOptions): Promise<any> {
        return new Promise<any[]>(resolve => {
            const searchData: any[] = [];
            this.db
                .createValueStream({
                    gt: opts.gt,
                    lt: opts.lt
                })
                .on("data", data => {
                    searchData.push(data);
                })
                .on("close", () => {
                    resolve(searchData);
                })
                .on("end", () => {
                    resolve(searchData);
                });
        });
    }

    private getDatabaseLocation(): string {
        try {
            fs.mkdirSync(this.opts.location, {recursive: true});
        } catch (e) {
            warn("creating database directories", e);
        }
        return this.opts.location;
    }
}
