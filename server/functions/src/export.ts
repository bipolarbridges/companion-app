import { FeatureSettings } from './services/config';
import * as functions from 'firebase-functions';
import { logNewAccount, logMeasurement } from './utils/remoteServices';

const fns: any = {};

// Database-event based export

fns.newAccount = FeatureSettings.ExportToDataServices
    && functions.firestore.document('/clients/{clientId}/accounts/{acctId}')
      .onCreate(async(snap, context) => {
        const acct = snap.data();
        const client = context.params.clientId;
        const coach = acct['coachId'];
        console.log(`New account for client[${client}], coach[${coach}]`);
        await logNewAccount(client, coach);
        return null;
      });

type RecordExport = {
    typeId: string,
    value: number
};

type RecordMapping = (d: any) => RecordExport[];

type Extractions = {
    [key: string] : RecordMapping
};

const prefix = (id: string): string => `maslo-${id}`;

const extract: Extractions = {
    // mappings for complex data types
    'mindfulness': 
        (d: any): RecordExport[] => [
            { typeId: prefix('mindfulness'), value: +d }
        ],
    'mentalHealth': 
        (d: any): RecordExport[] => [
            { typeId: prefix('mentalHealth'), value: +d }
        ],
}

fns.measurement = FeatureSettings.ExportToDataServices
&& functions.firestore.document('/records/{recordId}')
      .onCreate(async(snap, context) => {
          const data = snap.data();
          const makeRequest = (ex: RecordExport) => logMeasurement(
                data.clientUid, data.coachUid, ex.typeId, ex.value, data.date);
                
          // Q: should we mash into a single call?
          await Promise.all(Object.entries(extract).reduce((ps, [key, ext]) => {
            const val = data[key];
            if (val) {
                return ps.concat(ext(val).map(e => makeRequest(e)));
              } else if (val == null) {
                // value not recorded. Simply skip in this case
                return ps.concat([Promise.resolve()]);
              } else {
                return ps.concat([Promise.reject(`Key ${key} is not valid for record`)]);
              }
          }, ([] as Promise<void>[])));
      });

export const ExportFunctions = FeatureSettings.ExportToDataServices && fns;
