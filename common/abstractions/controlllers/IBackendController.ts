import { QolSurveyResults } from 'common/models/QoL';

export type RemoteCallResult = {
    error?: string,
    msg?: any,
    res?: any,
    jsoned?: any
};

export interface IBackendClient {
    post (path: string, data: any, opts: any): any;
    _get (path: string, opts: any): any;
}

export interface IBackendController {

    logNewAccount(clientID: string)
    : Promise<RemoteCallResult>;

    logMeasurement(clientID: string, source: string, subtype: string, value: number, date: number)
    : Promise<RemoteCallResult>;
}