import * as functions from 'firebase-functions';

export const exportClient = functions.firestore.document('/clients/{clientId}/accounts/{acctId}')
        // Database-event based export
        // TODO should use a different record type or use client/coach account as id
      .onCreate((snap, context) => {
        const acct = snap.data();
        console.log(`New account for client[${context.params.clientId}], ${JSON.stringify(acct)}`);
        return null;
      });