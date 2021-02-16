import { FeatureSettings } from './services/config';
import * as functions from 'firebase-functions';

const fns: any = {};

fns.newAccount = FeatureSettings.ExportToDataServices
    && functions.firestore.document('/clients/{clientId}/accounts/{acctId}')
        // Database-event based export
      .onCreate((snap, context) => {
        const acct = snap.data();
        console.log(`New account for client[${context.params.clientId}], ${JSON.stringify(acct)}`);
        return null;
      });

export const ExportFunctions = FeatureSettings.ExportToDataServices && fns;
