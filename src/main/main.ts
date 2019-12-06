/* eslint-disable */
import { app, BrowserWindow, ipcMain } from "electron";
import path from "path";
import url from "url";
import { setApplicationMenu } from './menu';
import { DatabaseHandler } from "./database";
import { SAVE_TO_DATABASE_REQUEST, GET_FROM_DATABASE_REQUEST } from "../renderer/constants/keystore";
import { IIpcDatabaseEntry } from "../renderer/services/interfaces";

let win: BrowserWindow | null;
let databaseHandler: DatabaseHandler;

const installExtensions = async () => {
    // eslint-disable-next-line @typescript-eslint/no-require-imports,@typescript-eslint/no-var-requires
    const installer = require("electron-devtools-installer");
    const forceDownload = !!process.env.UPGRADE_EXTENSIONS;
    const extensions = ["REACT_DEVELOPER_TOOLS", "REDUX_DEVTOOLS"];

    return Promise.all(extensions.map(name => installer.default(installer[name], forceDownload))).catch(console.log);
};

const iconExtensions = {
    darwin: ".ics",
    win32: ".ico",
    linux: ".png",
    aix: ".png",
    android: ".png",
    freebsd: ".png",
    openbsd: ".png",
    sunos: ".png",
    cygwin: ".png"
};

const createWindow = async () => {
    if (process.env.NODE_ENV !== "production") {
        await installExtensions();
    }

    const iconPath = path.join(
        __dirname,
        `../src/renderer/assets/ico/app_icon${iconExtensions[process.platform]}`
    );
    win = new BrowserWindow({
        webPreferences: { nodeIntegration: true },
        backgroundColor: "#052437",
        show: false,
        icon: iconPath,
    });
    win.maximize();
    win.once("ready-to-show", () => {
        if (win !== null) { win.show(); }
    });
    win.webContents.on("did-finish-load", async () => {
        if (win !== null) {
            win.setTitle("ChainGuardian");
            databaseHandler = new DatabaseHandler()
            await databaseHandler.start()
        }
    });

    if (process.env.NODE_ENV !== "production") {
        process.env.ELECTRON_DISABLE_SECURITY_WARNINGS = "1";
        win.loadURL("http://localhost:2003");
    } else {
        win.loadURL(
            url.format({
                pathname: path.join(__dirname, "index.html"),
                protocol: "file:",
                slashes: true
            })
        );
    }

    if (process.env.NODE_ENV !== "production" && process.env.NODE_ENV !== "test") {
        // Open DevTools, see https://github.com/electron/electron/issues/12438 for why we wait for dom-ready
        win.webContents.once("dom-ready", () => {
            win!.webContents.openDevTools();
        });
    }

    win.on("closed", async () => {
        await databaseHandler.stop()
        win = null;
    });
    
    ipcMain.on(SAVE_TO_DATABASE_REQUEST, (event, arg: IIpcDatabaseEntry) => {
        databaseHandler.saveToDatabase(arg.id, arg.account)
        event.returnValue = true
    })

    ipcMain.on(GET_FROM_DATABASE_REQUEST, async (event, id: string) => {
        const account = await databaseHandler.getFromDatabase(id)
        event.returnValue = account
    })
    
    setApplicationMenu();
};

app.on("ready", createWindow);

app.on("window-all-closed", () => {
    if (process.platform !== "darwin") {
        app.quit();
    }
});

app.on("activate", () => {
    if (win === null) {
        createWindow();
    }
});
