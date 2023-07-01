export enum AlertTypes {
    success = "success",
    error = "error",
}

export interface Alert {
    id: string;
    type: AlertTypes;
    message: string;
    timeout?: number;
}
