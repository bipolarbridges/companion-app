import { PartialQol, QolSurveyResults } from 'common/models/QoL';

export interface IQoLController {

    getSurveyResults(): Promise<QolSurveyResults>;

    sendSurveyResults(results: QolSurveyResults, startDate: number, questionCompletionDates: number[]): Promise<boolean>;

    sendPartialQol(qol: PartialQol): Promise<boolean>;

    getPartialQol(): Promise<PartialQol>;

    setUser(userId: string): void;
}