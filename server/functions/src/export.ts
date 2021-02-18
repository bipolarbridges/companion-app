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
          const { clientId, coachId, mentalHealth, date } = snap.data();
          console.log(`New measurement record for client[${clientId}], coach[${coachId}]`);
          await logMeasurement(clientId, coachId, 'mentalHealth', mentalHealth, date);
          // TODO generalize to more record values
          // Q: should we mash into a single call?
      });

export const ExportFunctions = FeatureSettings.ExportToDataServices && fns;
