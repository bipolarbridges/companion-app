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

fns.measurement = FeatureSettings.ExportToDataServices
&& functions.firestore.document('/records/{recordId}')
      .onCreate(async(snap, context) => {
          const data = snap.data();
          const quantFields = [
            'mentalHealth',
            'mindfulness',
          ];
          // Q: should we mash into a single call?
          await Promise.all(quantFields.map(
              key => {
                  const typeId = `maslo-fb-${key}`; // TODO: figure out universal ids
                  const val = data[key];
                  if (val) {
                    return logMeasurement(data.clientUid, data.coachUid, typeId, val, data.date);
                  } else if (val == null) {
                    // value not recorded. Simply skip in this case
                    return Promise.resolve();
                  } else {
                    return Promise.reject(`Key ${key} is not valid for record`);
                  }
              }));
      });

export const ExportFunctions = FeatureSettings.ExportToDataServices && fns;
