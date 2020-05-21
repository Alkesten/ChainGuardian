import {Keypair} from "@chainsafe/bls";
import {PrivateKey} from "@chainsafe/bls/lib/privateKey";
import {config} from "@chainsafe/lodestar-config/lib/presets/minimal";
import {ValidatorResponse} from "@chainsafe/lodestar-types";
import {IValidatorOptions} from "@chainsafe/lodestar-validator/lib";
import {Action, Dispatch} from "redux";

import {ValidatorActionTypes} from "../constants/action-types";
import {IValidator} from "../containers/Dashboard/DashboardContainer";
import {IRootState} from "../reducers";
import database from "../services/db/api/database";
import {ValidatorDB} from "../services/db/api/validator";
import {EthersNotifier} from "../services/deposit/ethers";
import {ValidatorLogger} from "../services/eth2/client/logger";
import {getNetworkConfig} from "../services/eth2/networks";
import {fromHex} from "../services/utils/bytes";
import {getValidatorStatus} from "../services/validator/status";
import {ValidatorStatus} from "../services/validator/status/statuses";
import {loadValidatorBeaconNodes} from "./network";

export interface ILoadValidators {
    type: typeof ValidatorActionTypes.LOAD_VALIDATORS,
    payload: Array<IValidator>,
}

export const loadValidatorsAction = () => {
    return async (dispatch: Dispatch<Action<unknown>>, getState: () => IRootState): Promise<void> => {
        const auth = getState().auth;
        if (auth && auth.account) {
            const validators = auth.account.getValidators();
            const validatorArray = validators.map((v) => ({
                name: auth.account!.name,
                status: undefined,
                publicKey: v.publicKey.toHexString(),
                network: auth.account!.getValidatorNetwork(v.publicKey.toHexString()),
                privateKey: v.privateKey.toHexString()
            }));

            dispatch({
                type: ValidatorActionTypes.LOAD_VALIDATORS,
                payload: validatorArray
            });

            // Initialize all validator objects with API clients
            await Promise.all(validatorArray.map(async (v) => {
                await loadValidatorBeaconNodes(v.publicKey, true)(dispatch, getState);
                // Load validator state from chain for i.e. balance
                // TODO: load all validators in one request per network
                loadValidatorsFromChain([v.publicKey])(dispatch, getState);
                loadValidatorStatus(v.publicKey)(dispatch, getState);
            }));
        }
    };
};

export const loadValidatorsFromChain = (validators: string[]) => {
    return async (dispatch: Dispatch<Action<ValidatorActionTypes>>, getState: () => IRootState): Promise<void> => {
        const beaconNodes = getState().network.validatorBeaconNodes[validators[0]];
        // TODO: Use any working beacon node instead of first one
        const client = beaconNodes[0].client;
        const pubKeys = validators.map(address => fromHex(address));
        const response = await client.beacon.getValidators(pubKeys);

        dispatch({
            type: ValidatorActionTypes.LOADED_VALIDATORS_FROM_CHAIN,
            payload: response
        });
    };
};

export const loadValidatorStatus = (validatorAddress: string) => {
    return async (dispatch: Dispatch<Action<ValidatorActionTypes>>, getState: () => IRootState): Promise<void> => {
        const beaconNodes = getState().network.validatorBeaconNodes[validatorAddress];
        // TODO: Use any working beacon node instead of first one
        const eth2 = beaconNodes[0].client;
        const network = getState().validators[validatorAddress].network;
        const networkConfig = getNetworkConfig(network);
        const eth1 = new EthersNotifier(networkConfig, networkConfig.eth1Provider);
        const status = await getValidatorStatus(fromHex(validatorAddress), eth2, eth1);

        dispatch({
            type: ValidatorActionTypes.LOAD_STATUS,
            payload: {
                validator: validatorAddress,
                status,
            },
        });
    };
};

export interface ILoadValidatorStatusAction {
    type: typeof ValidatorActionTypes.LOAD_STATUS,
    payload: {
        validator: string;
        status: ValidatorStatus;
    },
}

export interface ILoadedValidatorsFromChainAction {
    type: typeof ValidatorActionTypes.LOADED_VALIDATORS_FROM_CHAIN;
    payload: ValidatorResponse[];
}

export interface IStartValidatorServiceAction {
    type: typeof ValidatorActionTypes.START_VALIDATOR_SERVICE,
    payload: IValidatorOptions,
}

export const startValidatorService = (publicKey: string) => {
    return (dispatch: Dispatch<Action<ValidatorActionTypes>>, getState: () => IRootState): void => {
        const logger = new ValidatorLogger();
        const privateKey = PrivateKey.fromHexString(getState().validators[publicKey].privateKey);
        // TODO: Use beacon chain proxy instead of first node
        const eth2API = getState().network.validatorBeaconNodes[publicKey][0].client;

        dispatch({
            type: ValidatorActionTypes.START_VALIDATOR_SERVICE,
            payload: {
                db: new ValidatorDB(database),
                api: eth2API,
                config,
                keypair: new Keypair(privateKey),
                logger
            },
        });
    };
};

export interface IStopValidatorServiceAction {
    type: typeof ValidatorActionTypes.STOP_VALIDATOR_SERVICE,
    payload: string,
}

export const stopValidatorService = (publicKey: string) => {
    return (dispatch: Dispatch<Action<ValidatorActionTypes>>): void => {
        dispatch({
            type: ValidatorActionTypes.STOP_VALIDATOR_SERVICE,
            payload: publicKey,
        });
    };
};
