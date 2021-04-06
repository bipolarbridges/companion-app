import mockProcess from './mocks/client/process';
process = mockProcess;

import { init } from './util/firebase';
import { fail } from 'assert';
const { expect } = require('chai');
import { createNewEmailUser, clearAllUsers } from './util/auth';
import clientConfig from './mocks/client/config';
import { GetTokenResult, IAuthController } from '../../../common/abstractions/controlllers/IAuthController';
import { ClientAuthController } from './mocks/client/controllers';
import { Users as UsersFunctions } from '../../../common/abstractions/functions';
import Firebase, { initializeAsync } from '../../../common/services/firebase';
import { validateToken } from '../src/auth';

// Initialize testing server
const test = init('auth-test');

const users = [
    { email: 'user0@test.com', password: 'secret0' },
    { email: 'user1@test.com', password: 'secret1' },
];

// Some functions for loading, removing tests data
async function setUpUsers() {
    console.log('Creating users...');
    const result = await createNewEmailUser(users[0].email, users[0].password);
    if (!result) {
        fail();
    }
}
async function clearUsers() {
    console.log('Deleting users...');
    const result = await clearAllUsers();
    if (!result) {
        fail();
    }
}

// Tests
let auth: IAuthController = null;
describe('Authentication', () => {
    beforeAll(async () => {
        // Initialize testing client
        await initializeAsync(clientConfig);
    });
    beforeEach(async () => {
        await setUpUsers();
        auth = new ClientAuthController();
    });
    afterEach(async () => {
        auth = null;
        await test.cleanup();
        await clearUsers();
    });
    it('Should not generate an id token if client is not signed in', async () => {
        const getTokenResult = await auth.getAuthToken();
        expect(getTokenResult.result).to.be.false;
        expect(getTokenResult.token).to.be.undefined;
    });
    it('Should generate an id token for a logged in user', async () => {
        await auth.signInWithEmailPassword(users[0].email, users[0].password);
        const getTokenResult: GetTokenResult = await auth.getAuthToken();
        expect(getTokenResult.result).to.be.true;
        if (getTokenResult.token) {
            console.log(`Token: ${getTokenResult.token}`);
        } else {
            fail();
        }
    });
    it('Should not validate an invalid token', async () => {
        await auth.signInWithEmailPassword(users[0].email, users[0].password);
        const validate = await Firebase.Instance.getFunction(UsersFunctions.ValidateToken);
		 const args: any = {
			 type: 'validateToken',
			 token: 'notavalidtoken',
			 email: users[0].email,
		 };
		 // TODO: would like to invoke the function using the wrapper above
		 // currently experiencing issues in the emulation environment despite
		 // curl requests to the emulator going through. Perhaps a problem with
		 // Firebase versions?
		 const res = await validateToken(args); // await validate.execute(args);
		 expect(res.result).to.be.false;
    });
    it('Should validate a valid token if the provided email is correct', async () => {
        await auth.signInWithEmailPassword(users[0].email, users[0].password);
        const getTokenResult: GetTokenResult = await auth.getAuthToken();
        const token = getTokenResult.token;
        const validate = await Firebase.Instance.getFunction(UsersFunctions.ValidateToken);
		 const args: any = {
			 type: 'validateToken',
			 token: token,
			 email: users[0].email,
		 };
		 const res = await validateToken(args); // await validate.execute(args);
		// TODO: currently fails due to an inconsistency with tokens in the emulator
		 // environment (I think) - should figure out a way to fix this
		 expect(res.result).to.be.true;
    });
    it('Should not validate a valid token if the provided email is incorrect', async () => {
        await auth.signInWithEmailPassword(users[0].email, users[0].password);
        const getTokenResult: GetTokenResult = await auth.getAuthToken();
        const token = getTokenResult.token;
        const validate = await Firebase.Instance.getFunction(UsersFunctions.ValidateToken);
		 const args: any = {
			 type: 'validateToken',
			 token: token,
			 email: users[1].email,
		 };
		 const res = await validateToken(args); // await validate.execute(args);
		 expect(res.result).to.be.false;
    });
});
