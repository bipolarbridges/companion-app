import { PartialQol, QolSurveyResults } from 'common/models/QoL';

export interface IBackendController {

    getSurveyResults(): Promise<QolSurveyResults>;

    sendSurveyResults(results: QolSurveyResults): Promise<boolean>;

    sendPartialQol(qol: PartialQol): Promise<boolean>;

    getPartialQol(): Promise<PartialQol>;

    setUser(userId: string): void;
}