import {
    IEth2BeaconApi,
    IEth2NodeApi,
    IEth2ValidatorApi,
    IGenericEth2Client
} from "../../../../../src/renderer/services/eth2/client/interface";
import {IBeaconConfig} from "@chainsafe/lodestar-config";
import sinon, {SinonStubbedInstance} from "sinon";
import {LighthouseBeaconApiClient} from "../../../../../src/renderer/services/eth2/client/lighthouse/beacon";
import {LighthouseValidatorApiClient} from "../../../../../src/renderer/services/eth2/client/lighthouse/validator";
import EventEmitter from "events";
import {LighthouseNodeApiClient} from "../../../../../src/renderer/services/eth2/client/lighthouse/node";

export class MockEth2ApiClient extends EventEmitter implements IGenericEth2Client {
    public config: IBeaconConfig;
    public url: string;
    public beacon: SinonStubbedInstance<IEth2BeaconApi>;
    public node: SinonStubbedInstance<IEth2NodeApi>;
    public validator: SinonStubbedInstance<IEth2ValidatorApi>;

    public connect = sinon.stub();
    public disconnect = sinon.stub();
    public getCurrentSlot = sinon.stub();
    public getVersion = sinon.stub();
    //todo refactor this to emit based on this.on()
    public onNewChainHead = sinon.stub();
    public onNewEpoch = sinon.stub();
    public onNewSlot = sinon.stub();

    public constructor(config: IBeaconConfig) {
        super();
        this.config = config;
        this.beacon = sinon.createStubInstance(LighthouseBeaconApiClient);
        this.node = sinon.createStubInstance(LighthouseNodeApiClient);
        this.validator = sinon.createStubInstance(LighthouseValidatorApiClient);
    }

}
