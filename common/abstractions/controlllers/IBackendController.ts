import { QolSurveyResults } from 'common/models/QoL';

export type RemoteCallResult = {
    error?: string,
    message?: any,
};

export interface IBackendClient {
    post (path: string, data: any, opts: any): any;
    _get (path: string, opts: any): any;
}

export interface IBackendController {

    logNewAccount(clientID: string, coachID: string)
    : Promise<RemoteCallResult>;

    logMeasurement(clientID: string, coachID: string, type: string, value: number, date: number)
    : Promise<RemoteCallResult>;

    logSurveyResult(clientID: string, date: number, result: QolSurveyResults)
    : Promise<RemoteCallResult>;

    pingTest()
    : Promise<RemoteCallResult>;
}