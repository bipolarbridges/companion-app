import { FirebaseConfig } from '../../../../common/services/firebase';

import axios, { AxiosResponse } from 'axios';
import { env } from '../../../../env';

const fbConfig: FirebaseConfig = env.production.firebase.config;

const FB_HEADERS = {
    // this is hard-coded to match secret specification for emulator. See
    // https://github.com/firebase/firebase-tools/issues/1363#issuecomment-498364771)
    'Authorization': 'Bearer owner',
};

const authEndpoint = axios.create({
    baseURL: 'http://localhost:9099/identitytoolkit.googleapis.com/v1',
    headers: FB_HEADERS,
});

const adminEndpoint = axios.create({
    baseURL: `http://localhost:9099/emulator/v1/projects/${fbConfig.projectId}`,
    headers: FB_HEADERS,
});

async function assertResult(rout: Promise<any>, result: boolean = true): Promise<boolean> {
    return rout.then((res: any) => {
        return result;
    }).catch((err: any) => {
        console.log(err);
        return !result;
    });
}

export async function createNewEmailUser(user: { email: string, password: string }): Promise<string> {
    // Create user
    return authEndpoint.post('/accounts:signUp', user, {
        headers: {
            'Content-Type': 'application/json',
        },
    })
    .then((res: AxiosResponse) => {
        return res.data.localId; // this is the id of the new user
    })
    .catch((err: any) => {
        console.log(err);
        throw new Error('error sending sign up request');
    });
    // // Sanity-check: confirm that same user cannot be created again
    // return assertResult(authEndpoint.post('/accounts:signUp', { email, password }), false);
}

export async function clearAllUsers(): Promise<boolean> {
    return assertResult(adminEndpoint.delete('/accounts'));
}
