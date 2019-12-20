import {RegisterActionTypes} from "../constants/action-types";
import {Action, Dispatch} from "redux";
import {IRootState} from "../reducers";
import {V4Keystore} from "../services/keystore";
import {Keypair} from "@chainsafe/bls/lib/keypair";
import {PrivateKey} from "@chainsafe/bls/lib/privateKey";
//import {KEYSTORE_DEFAULT_DIRECTORY} from "../constants/keystore";
import {saveToDatabase} from "../services/utils/db-utils";
import {KEYSTORE_DEFAULT_DIRECTORY} from "../constants/keystore";
import {CGAccount} from "../models/account";
import {getV4Filename} from "../services/utils/crypto-utils";

// Mnemonic Failed Verification
export const storeSigningMnemonicVerificationStatusAction = (failedVerification: boolean) =>
    (dispatch: Dispatch<IFailedVerificationAction>): void => {
        dispatch(setSigningMnemonicVerificationStatus(failedVerification));
    };

export const setSigningMnemonicVerificationStatus = (failedVerification: boolean): IFailedVerificationAction => ({
    type: RegisterActionTypes.SET_SIGNING_MNEMONIC_VERIFICATION_STATUS, payload: {failedVerification}
});

export interface IStoreFailedVerificationPayload {
    failedVerification: boolean;
}

export interface IFailedVerificationAction extends Action<RegisterActionTypes> {
    payload: IStoreFailedVerificationPayload;
}

// Mnemonic action
export const storeSigningKeyMnemonicAction = (mnemonic: string) =>
    (dispatch: Dispatch<ISigningKeyMnemonicAction>): void => {
        dispatch(setMnemonic(mnemonic));
    };

export const setMnemonic = (mnemonic: string): ISigningKeyMnemonicAction => ({
    type: RegisterActionTypes.STORE_SIGNING_KEY_MNEMONIC, payload: {mnemonic}
});

export interface IStoreSigningKeyMnemonicPayload {
    mnemonic: string;
}

export interface ISigningKeyMnemonicAction extends Action<RegisterActionTypes> {
    payload: IStoreSigningKeyMnemonicPayload;
}

// Signing key action
export const storeSigningKeyAction = (signingKey: string) =>
    (dispatch: Dispatch<ISigningKeyAction>): void => {
        dispatch(setSigningKey(signingKey));
    };

export const setSigningKey = (signingKey: string): ISigningKeyAction => ({
    type: RegisterActionTypes.STORE_SIGNING_KEY, payload: {signingKey}
});
export interface IStoreSigningKeyPayload {
    signingKey: string;
}

export interface ISigningKeyAction extends Action<RegisterActionTypes> {
    payload: IStoreSigningKeyPayload;
}

// Withdrawal key action
export const storeWithdrawalKeyAction = (withdrawalKey: string) =>
    (dispatch: Dispatch<IWithdrawalKeyAction>): void => {
        dispatch(setWithdrawalKey(withdrawalKey));
    };

export const setWithdrawalKey = (withdrawalKey: string): IWithdrawalKeyAction => ({
    type: RegisterActionTypes.STORE_WITHDRAWAL_KEY, payload: {withdrawalKey}
});
export interface IStoreWithdrawalKeyPayload {
    withdrawalKey: string;
}

export interface IWithdrawalKeyAction extends Action<RegisterActionTypes> {
    payload: IStoreWithdrawalKeyPayload;
}

// After password action
export const afterPasswordAction = (password: string) => {
    return (dispatch: Dispatch<Action<RegisterActionTypes>>, getState: () => IRootState): void => {
        // 1. Save to keystore
        const signingKey = getState().register.signingKey;
        V4Keystore.create(
            `${KEYSTORE_DEFAULT_DIRECTORY}/${getV4Filename()}.json`, 
            password, new Keypair(PrivateKey.fromHexString(signingKey))
        );

        // 2. Save account to db
        const account = new CGAccount({
            name: "Test Account",
            directory: KEYSTORE_DEFAULT_DIRECTORY,
            sendStats: false
        });
        
        saveToDatabase({
            id: "account",
            account
        });
        
        // 3. Delete keys from redux
        dispatch(setClearKeys());
    };
};


export const setClearKeys = (): Action<RegisterActionTypes> => ({
    type: RegisterActionTypes.CLEAR_KEYS
});