import { DomainMagnitudesData, PartialQol, QolSurveyResults } from "common/models/QoL";

export type Domains = string[];

export interface IBackendController {

    getSurveyResults(): Promise<QolSurveyResults>;

    sendSurveyResults(results: QolSurveyResults): Promise<boolean>;

    sendPartialQol(domainMags: DomainMagnitudesData, surveyScores: QolSurveyResults,
        questionNumber: number, domainNumber: number, isFirstTimeQol: boolean): Promise<boolean>;

    getPartialQol(): Promise<PartialQol>;

    // setDomainMagnitudes(magnitudes: any): Promise<boolean>;

    setDomain(domain: string): Promise<boolean>;

    getDomains(): Promise<Domains>;
}