import { FeatureSettings } from './services/config';
import * as functions from 'firebase-functions';
import { SentimentAnalysis, SentimentValue } from '../../../common/models/Sentiment';
import { EnergyValue, RecordData } from '../../../common/models/RecordData';
import { FunctionBackendController } from '../src/services/backend';
import {
    RemoteCallResult,
} from '../../../common/abstractions/controlllers/IBackendController';
import Collections from 'common/database/collections';
import { QolSurveyResults } from 'common/models/QoL';

const fns: any = {};

// Database-event based export

type ExportResult = {
    error?: any,
    msg?: any
};

fns.newAccount = FeatureSettings.ExportToDataServices
    && functions.firestore.document('/clients/{clientId}/accounts/{clientCardId}')
        .onCreate(async (snap, context) => {
            const backend = new FunctionBackendController();
            const acct = snap.data();
            const client = context.params.clientId;
            const coach = acct.coachId;
            console.log(`New account for client[${client}], coach[${coach}]`);
            const result: RemoteCallResult = await backend.logNewAccount(client, coach);
            console.log(result);
            return {
                error: result.error ? result.error : null,
                msg: result.message ? result.message : null,
            };
        });

type RecordExport = {
    typeId: string,
    value: number,
};

type RecordMapping = (d: any) => RecordExport[];

type Extractions = {
    [key: string]: RecordMapping,
};

const prefix = (id: string): string => `maslo-${id}`;

const extract: Extractions = {
    // mappings for complex data types
    'mindfulness':
        (d: number): RecordExport[] => [
            { typeId: prefix('mindfulness'), value: d },
        ],
    'mentalHealth':
        (d: number): RecordExport[] => [
            { typeId: prefix('mentalHealth'), value: +d },
        ],
    'sentiment':
        (s: SentimentAnalysis) => [
            {
                typeId: prefix('sentiment-doc-score'),
                value: s.documentSentiment.score,
            },
            {
                typeId: prefix('sentiment-doc-mag'),
                value: s.documentSentiment.magnitude,
            },
        ],
    'energyLevel':
        (e: EnergyValue) => {
            const data = [
                { typeId: prefix('energyLevel-original'), value: e.original },
            ];
            if (e.normalized) {
                data.push({
                    typeId: prefix('energyLevel-normalized'),
                    value: e.normalized,
                });
            }
            return data;
        },
};

type QolSurveyData = {
    userId: string,
    data: {
        date: number,
        results: QolSurveyResults,
    },
};

fns.measurement = FeatureSettings.ExportToDataServices
    && functions.firestore.document('/records/{recordId}')
        .onCreate(async (snap, context): Promise<ExportResult> => {
            const data: RecordData = snap.data() as RecordData;
            const backend = new FunctionBackendController();
            const makeRequest = async (ex: RecordExport) =>
                backend.logMeasurement(data.clientUid, data.coachUid, ex.typeId, ex.value, data.date)
                .then((res: RemoteCallResult) => {
                    if (res.error) {
                        return Promise.reject(res);
                    } else {
                        return Promise.resolve();
                    }
                });
            // Q: should we mash into a single call?
            return Promise.all(Object.entries(extract).reduce((ps, [key, ext]) => {
                const val = data[key];
                if (val) {
                    return ps.concat(ext(val).map(e => makeRequest(e)));
                } else if (val == null) {
                    // value not recorded. Simply skip in this case
                    return ps.concat([Promise.resolve()]);
                } else {
                    return ps.concat([Promise.reject(`Key ${key} is not valid for record`)]);
                }
            }, ([] as Promise<void>[])))
            .then(() => {
                return { error: null };
            })
            .catch((e) => {
                console.log(e);
                return { error: e };
            });
        });

type QoLData = {
    userId: string,
    data: {
        date: number,
        results: QolSurveyResults,
    },
};

fns.qolsurvey = FeatureSettings.ExportToDataServices
    && functions.firestore.document(`/${Collections.SurveyResults}/{id}`)
        .onCreate(async (snap, context): Promise<ExportResult> => {
            const data: QoLData = snap.data() as QoLData;
            const backend = new FunctionBackendController();
            const result: ExportResult = await backend.logSurveyResult(data.userId, data.data.date, data.data.results);
            const ping: ExportResult = await backend.pingTest();
            console.log(result);
            console.log(ping);
            return {...result, ...ping};
        });

export const ExportFunctions = FeatureSettings.ExportToDataServices && fns;
