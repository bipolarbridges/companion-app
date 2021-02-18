import Axios from 'axios';

const ax = Axios.create({
	baseURL: "http://127.0.0.1:8888" // TODO
});

const API_KEY = "apikey1"

export async function logNewAccount(clientID, coachID) {
    await ax.post("/account",
        { clientID, coachID }, 
        {
            headers: {
                "Content-Type": "application/json",
                "Authorization": API_KEY
            }
        })
        .then((r) => {
            console.log(`Done!`)
        })
        .catch((e) => {
            console.log(`Error calling service: ${e}`);
        });
}

export async function logMeasurement(clientID, coachID, type, value, date) {
    await ax.post("/measurement",
        { 
            clientID, 
            coachID,
            data: {
                date,
                dataType: type,
                value,
            }
        }, 
        {
            headers: {
                "Content-Type": "application/json",
                "Authorization": API_KEY
            }
        })
        .then((r) => {
            console.log(`Done!`)
        })
        .catch((e) => {
            console.log(`Error calling service: ${e}`);
        });
}