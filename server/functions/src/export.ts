import { FeatureSettings } from './services/config';
import * as functions from 'firebase-functions';
import { logNewAccount } from './utils/remoteServices';

const fns: any = {};

fns.newAccount = FeatureSettings.ExportToDataServices
    && functions.firestore.document('/clients/{clientId}/accounts/{acctId}')
        // Database-event based export
      .onCreate(async(snap, context) => {
        const acct = snap.data();
        const client = context.params.clientId;
        const coach = acct['coachId'];
        console.log(`New account for client[${client}], coach[${coach}]`);
        await logNewAccount(client, coach);
        return null;
      });

export const ExportFunctions = FeatureSettings.ExportToDataServices && fns;
