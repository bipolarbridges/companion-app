import mockProcess from './mocks/client/process';
process = mockProcess;

import * as admin from 'firebase-admin';
import { initializeAsync, initializeAsync as initializeFirebaseAsync } from '../../../common/services/firebase';
import { fail } from 'assert';
const { expect } = require("chai");
import { createNewEmailUser, clearAllUsers } from './util/auth';
import clientConfig from './mocks/client/config';
import { GetTokenResult, IAuthController } from '../../../common/abstractions/controlllers/IAuthController';
import { ClientAuthController } from './mocks/client/controllers';

// Initialize testing server
const test = require("firebase-functions-test")({
    projectId: 'bipolarbridges',
  });
admin.initializeApp();

// Some functions for loading, removing tests data
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

// Tests
let auth: IAuthController = null;
describe("Authentication", () => {
    beforeAll(async () => {
        // Initialize testing client
        await initializeAsync(clientConfig);
    });
    beforeEach(async () => {
        await setUpUsers();
        auth = new ClientAuthController();
    });
    afterEach(async () => {
        test.cleanup();
        await clearUsers();
    });
    it("Should not generate an id token if client is not signed in", async () => {
        const getTokenResult = await auth.getAuthToken();
        expect(getTokenResult.result).to.be.false;
        expect(getTokenResult.token).to.be.undefined;
    });
    it("Should generate an id token for a logged in user", async () => {
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
