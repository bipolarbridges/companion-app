export type RemoteCallResult = {
    error?: string,
};

export interface IBackendController {

    logNewAccount
    (clientID: string, coachID: string)
    : Promise<RemoteCallResult>;

    logMeasurement
    (clientID: string, coachID: string, type: string, value: number, date: number)
    : Promise<RemoteCallResult>;

}