export type RemoteCallResult = {
    error?: string,
};

export interface IBackendClient {
    post (path: string, data: any, opts: any): any;
    _get (path: string, data: any, opts: any): any;
}

export interface IBackendController {

    logNewAccount(clientID: string, coachID: string)
    : Promise<RemoteCallResult>;

    logMeasurement(clientID: string, coachID: string, type: string, value: number, date: number)
    : Promise<RemoteCallResult>;
    
    pingTest() : Promise<RemoteCallResult>;
}