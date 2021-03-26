import mockProcess from './mocks/client/process';
process = mockProcess;

import * as admin from 'firebase-admin';
import AuthControllerBase from '../../../common/controllers/AuthController';
import { initializeAsync, initializeAsync as initializeFirebaseAsync } from '../../../common/services/firebase';
import { fail } from 'assert';
const { expect } = require("chai");
import { createNewEmailUser, clearAllUsers } from './util/auth';
import clientConfig from './mocks/client/config';
import StorageMock from './mocks/client/storage';
import { GetTokenResult } from '../../../common/abstractions/controlllers/IAuthController';

const test = require("firebase-functions-test")({
    projectId: 'bipolarbridges',
  });

initializeAsync(clientConfig);

class ClientAuthController extends AuthControllerBase {

    get targetRole(): any {
        throw new Error('Method not implemented.');
    }
    get locationUrl(): string {
        throw new Error('Method not implemented.');
    }
    protected get Storage(): any {
        return StorageMock;
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
    it("Should generate an id token for a logged in user", async () => {
        const auth = new ClientAuthController();
        await auth.signInWithEmailPassword('user0@test.com', 'secret0');
        const getTokenResult: GetTokenResult = await auth.getAuthToken();
        expect(getTokenResult.result).to.be.true;
        if (getTokenResult.token) {
            console.log(`Token: ${getTokenResult.token}`);
        } else {
            fail();
        }
    });
});
