import { PartialQol, QolSurveyResults } from 'common/models/QoL';

export type RemoteCallResult = {
    error?: string,
};

export interface IBackendClient {
    post (path: string, data: any, opts: any): any;
}

export interface IBackendController {
    
    logNewAccount
    (clientID: string, coachID: string)
    : Promise<RemoteCallResult>;
    
    logMeasurement
    (clientID: string, coachID: string, type: string, value: number, date: number)
    : Promise<RemoteCallResult>;

    getSurveyResults(): Promise<QolSurveyResults>;

    sendSurveyResults(results: QolSurveyResults): Promise<boolean>;

    sendPartialQol(surveyScores: QolSurveyResults,
        questionNumber: number, domainNumber: number, isFirstTimeQol: boolean): Promise<boolean>;

    getPartialQol(): Promise<PartialQol>;

    setUser(userId: string): void;
}