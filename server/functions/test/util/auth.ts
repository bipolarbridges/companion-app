const axios = require('axios');

const FB_HEADERS = {
    "Content-Type": "application/json",

    // this is hard-coded to match secret specification for emulator. See
    // https://github.com/firebase/firebase-tools/issues/1363#issuecomment-498364771)
    "Authorization": "Bearer owner"
};

const authEndpoint = axios.create({
	baseURL: "http://localhost:9099/identitytoolkit.googleapis.com/v1",
    headers: FB_HEADERS
});

const adminEndpoint = axios.create({
    baseURL: "http://localhost:9099/emulator/v1/projects/bipolarbridges",
    headers: FB_HEADERS
});

async function assertResult(rout: Promise<any>, result: boolean = true): Promise<boolean> {
    return rout.then((res: any) => {
        return result;
    }).catch((err: any) => {
        return !result;
    });
}

export async function createNewEmailUser(email: string, password: string): Promise<boolean> {
    // Create user
    return assertResult(authEndpoint.post('/accounts:signUp', { email, password }));
    // // Sanity-check: confirm that same user cannot be created again
    // return assertResult(authEndpoint.post('/accounts:signUp', { email, password }), false);
}

export async function clearAllUsers(): Promise<boolean> {
    return assertResult(adminEndpoint.delete('/accounts'));
}
