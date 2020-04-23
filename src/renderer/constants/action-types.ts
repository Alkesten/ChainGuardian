export enum RegisterActionTypes {
    STORE_SIGNING_MNEMONIC = "STORE_SIGNING_MNEMONIC",
    STORE_SIGNING_VERIFICATION_STATUS = "STORE_SIGNING_VERIFICATION_STATUS",
    STORE_SIGNING_KEY = "STORE_SIGNING_KEY",

    STORE_WITHDRAWAL_MNEMONIC = "STORE_WITHDRAWAL_MNEMONIC",
    STORE_WITHDRAWAL_VERIFICATION_STATUS = "STORE_WITHDRAWAL_VERIFICATION_STATUS",
    STORE_WITHDRAWAL_KEY = "STORE_WITHDRAWAL_KEY",

    START_REGISTRATION_SUBMISSION = "START_REGISTRATION_SUBMISSION",
    COMPLETED_REGISTRATION_SUBMISSION = "COMPLETED_REGISTRATION_SUBMISSION",

    START_ADDING_NEW_VALIDATOR = "START_ADDING_NEW_VALIDATOR",
    COMPLETE_ADDING_NEW_VALIDATOR = "COMPLETE_ADDING_NEW_VALIDATOR",

    SET_NETWORK = "SET_NETWORK",
}

export enum DepositActionTypes {
    WAIT_FOR_DEPOSIT = "WAIT_FOR_DEPOSIT",
    DEPOSIT_NOT_FOUND = "DEPOSIT_NOT_FOUND",
    STORE_DEPOSIT_TX_DATA = "STORE_DEPOSIT_TX_DATA",
    DEPOSIT_DETECTED = "DEPOSIT_DETECTED",
    RESET = "RESET"
}

export enum AuthActionTypes {
    STORE_AUTH = "STORE_AUTH",
    LOAD_VALIDATORS = "LOAD_VALIDATORS"
}

export enum NotificationActionTypes {
    ADD_NOTIFICATION = "ADD_NOTIFICATION",
    REMOVE_NOTIFICATION = "REMOVE_NOTIFICATION"
}

export enum NetworkActionTypes {
    SELECT_NETWORK = "SELECT_NETWORK",
    LOADED_VALIDATOR_BEACON_NODES = "LOADED_VALIDATOR_BEACON_NODES",
}
