import Axios from 'axios';

const ax = Axios.create({
    baseURL: 'http://127.0.0.1:8888', // TODO
});

const API_KEY = 'apikey1';

export type RemoteCallResult = {
    error?: string,
};

export async function
logNewAccount(clientID, coachID)
: Promise<RemoteCallResult> {
    return ax.post('/account',
        { clientID, coachID },
        {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': API_KEY,
            },
        })
        .then((r) => {
            return { error: null };
        })
        .catch((e) => {
            return {
                error: `Error calling service: ${e}`,
            };
        });
}

export async function
logMeasurement(clientID, coachID, type, value, date)
: Promise<RemoteCallResult> {
    return ax.post('/measurement',
        {
            clientID,
            coachID,
            data: {
                date,
                dataType: type,
                value,
            },
        },
        {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': API_KEY,
            },
        })
        .then((r) => {
            return { error: null };
        })
        .catch((e) => {
            return {
                error: `Error calling service: ${e}`,
            };
        });
}