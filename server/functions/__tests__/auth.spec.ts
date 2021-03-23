process.env.APP_ENV = 'staging';
process.firebaseForPlatform = {
    android: {
        apiKey: '...'
    },
    ios: {

    }
}
// TODO: these configs and the mock used below leave
// a lot to be desired - should figure out why configs don't
// load in process

import * as admin from 'firebase-admin';
import AuthControllerBase from '../../../common/controllers/AuthController';
import { initializeAsync, initializeAsync as initializeFirebaseAsync } from '../../../common/services/firebase';
import { fail } from 'assert';
const { expect } = require("chai");
import { createNewEmailUser, clearAllUsers } from './util/auth';
//import Env from '../../../dashboard/app/constants/env';
import clientConfig from './mocks/firebase/client/config';

const test = require("firebase-functions-test")({
    projectId: 'bipolarbridges',
  });

//admin.initializeApp();
initializeAsync(clientConfig);

class ClientAuthController extends AuthControllerBase {

    get targetRole(): any {
        throw new Error('Method not implemented.');
    }
    get locationUrl(): string {
        throw new Error('Method not implemented.');
    }
    protected get Storage(): any {
        throw new Error('Method not implemented.');
    }
    signInWithEmailLink(email: string, reason: any): Promise<void> {
        throw new Error('Method not implemented.');
    }
    protected googleSignOut(): Promise<void> {
        throw new Error('Method not implemented.');
    }

}

async function setUpUsers() {
    console.log("Creating users...");
    const result = await createNewEmailUser('user0@test.com', 'secret0');
    if (!result) {
        fail();
    }
}

async function clearUsers() {
    console.log("Deleting users...");
    const result = await clearAllUsers();
    if (!result) {
        fail();
    }
}

admin.initializeApp();

type ProcessEnv = 'production' | 'staging' | 'development';

const environment = {
    APP_ENV: 'production' as ProcessEnv
};

describe("Auth Functions", () => {
    beforeEach(async () => {
        await setUpUsers();
    })
    afterEach(async () => {
        test.cleanup();
        await clearUsers();
    });
    it("Should not generate an id token if client is not signed in", async () => {
        const getTokenResult = await new ClientAuthController().getAuthToken();
        expect(getTokenResult.result).to.be.false;
        expect(getTokenResult.token).to.be.undefined;
    });
});
