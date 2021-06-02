import mockProcess from './mocks/client/process';
process = mockProcess;

import { fail } from 'assert';
import { expect, assert } from 'chai';

import { initializeAsync } from '../../../common/services/firebase';
import * as firebase from './util/firebase';
import clientConfig from './mocks/client/config';

import { createDomain, createQuestion, getDomains, getQuestions } from 'server/qol';
import { QoLActionTypes } from 'common/models/dtos/qol';
// import { IBackendController } from 'common/abstractions/controlllers/IBackendController';
import * as userData from './mocks/data/users';
import { ClientAuthController } from './mocks/client/controllers';
import { IAuthController } from 'common/abstractions/controlllers/IAuthController';
import IQoLController from 'common/controllers/QoLController';
import { PartialQol } from 'common/models/QoL';
import QoLControllerBase from 'common/controllers/QoLController';

const test = firebase.init('qol-test');

async function fbCleanup() {
    await firebase.clear();
    await test.cleanup();
}

describe('QoL API', () => {
    beforeAll(async () => {
        // Initialize testing client
        await initializeAsync(clientConfig);
    });
    describe('Domains', () => {
        describe('Domain Creation', () => {
            afterEach(fbCleanup);
            it('Should allow a domain to be created', async () => {
                const result = await createDomain({
                    type: QoLActionTypes.CreateDomain,
                    scope: 'GENERAL',
                    position: 1,
                    name: 'Physical',
                    slug: 'physical',
                });
                assert.isNull(result.error);
            });
            it('Should not allow a domain to be created if the scope is not valid', async () => {
                const result = await createDomain({
                    type: QoLActionTypes.CreateDomain,
                    scope: 'NOT_A_VALID_SCOPE',
                    position: 1,
                    name: 'Physical',
                    slug: 'physical',
                });
                assert.isNotNull(result.error);
            });
        });
        describe('Domain List', () => {
            afterEach(fbCleanup);
            it('Should list no domains before any are added', async () => {
                const result = await getDomains();
                assert.isNull(result.error);
                assert.lengthOf(result.results, 0);
            });
            it('Should list domains that are added', async () => {
                await createDomain({
                    type: QoLActionTypes.CreateDomain,
                    scope: 'GENERAL',
                    position: 1,
                    name: 'Physical',
                    slug: 'physical',
                });
                const result = await getDomains();
                assert.isNull(result.error);
                assert.lengthOf(result.results, 1);
            });
        });
    });
    describe('Question Creation', () => {
        afterEach(fbCleanup);
        it('Should not allow a question to be created if the domain slug is invalid', async () => {
            const result = await createQuestion({
                type: QoLActionTypes.CreateQuestion,
                text: 'had plenty of energy',
                domainSlug: 'not_a_valid_slug',
                position: 1,
            });
            assert.isNotNull(result.error);
        });
        it('Should allow a question to be created referring to a domain', async () => {
            await createDomain({
                type: QoLActionTypes.CreateDomain,
                scope: 'GENERAL',
                position: 1,
                name: 'Physical',
                slug: 'physical',
            });
            const createResult = await createQuestion({
                type: QoLActionTypes.CreateQuestion,
                text: 'had plenty of energy',
                domainSlug: 'physical',
                position: 1,
            });
            assert.isNull(createResult.error);
            const getResult = await getQuestions({
                type: QoLActionTypes.GetQuestions,
            });
            assert.lengthOf(getResult.results, 1);
        });
    });
});

const qolData = [
    {
        'physical': 10,
        'sleep': 7,
        'mood': 10,
        'cognition': 7,
        'leisure': 10,
        'relationships': 10,
        'spiritual': 8,
        'money': 8,
        'home': 10,
        'self-esteem': 8,
        'independence': 10,
        'identity': 10,
    },
    {
        'physical': 7,
        'sleep': 7,
        'mood': 10,
        'cognition': 7,
        'leisure': 8,
        'relationships': 10,
        'spiritual': 8,
        'money': 8,
        'home': 10,
        'self-esteem': 8,
        'independence': 10,
        'identity': 1,
    },
];

let auth: IAuthController = null;
let backend: IQoLController = null; // this is the component under test

async function setUser(idx: number): Promise<userData.User> {
    await auth.signOut(); // we are using indexed users
    const u = userData.getUser(idx);
    await auth.signInWithEmailPassword(u.email, u.password);
    backend.setUser(userData.getId(idx));
    return u;
}

describe('QoL Helpers', () => {
    beforeAll(async () => {
        await initializeAsync(clientConfig);
    });
    describe('Partial State Sync', () => {
        afterEach(async () => {
            await fbCleanup();
            await userData.clear();
        });
        beforeEach(async () => {
            await userData.create();
            auth = new ClientAuthController();
            backend = new QoLControllerBase();
            const u = userData.getUser();
            await auth.signInWithEmailPassword(u.email, u.password);
        });
        it('Should properly indicate when no state exists', async () => {
            const result: PartialQol = await backend.getPartialQol();
            assert.isNull(result);
        });
        it('Should set partial state', async () => {
            const sendResult: boolean = await backend.sendPartialQol(null, qolData[0], 0, 0);
            assert.isTrue(sendResult);
            const getResult: PartialQol = await backend.getPartialQol();
            assert.equal(getResult.scores, qolData[0]);
        });
        it('Should restore the latest state', async () => {
            assert.notEqual(qolData[0], qolData[1]);
            await backend.sendPartialQol(null, qolData[0], 0, 0);
            await backend.sendPartialQol(null, qolData[1], 0, 0);
            const getResult: PartialQol = await backend.getPartialQol();
            assert.equal(getResult.scores, qolData[1]);
        });
        it('Should manage state per user', async () => {
            assert.notEqual(qolData[0], qolData[1]);

            // first user, and send
            await setUser(0);
            await backend.sendPartialQol(null, qolData[0], 0, 0);

            // second user, send, get
            await setUser(1);
            await backend.sendPartialQol(null, qolData[1], 0, 0);
            let getResult: PartialQol = await backend.getPartialQol();
            assert.equal(getResult.scores, qolData[1]);

            // first user, get
            await setUser(0);
            getResult = await backend.getPartialQol();
            assert.equal(getResult.scores, qolData[0]);
        });
    });
});
