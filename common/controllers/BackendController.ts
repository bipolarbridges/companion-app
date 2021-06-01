import { QolSurveyResults } from '../models/QoL';
import {
    IBackendClient,
    IBackendController, RemoteCallResult,
} from '../abstractions/controlllers/IBackendController';

export default abstract class BackendControllerBase implements IBackendController {

    protected abstract get Client(): IBackendClient;
    protected abstract get Authorization(): string;

    public logNewAccount(id: string, coachID: string): Promise<RemoteCallResult> {
        console.log(`Using key: ${this.Authorization}`);
        return this.Client.post('/client',
            { id: id },
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': this.Authorization,
                },
            })
            .then((res: any) => {
                return { error: null } as RemoteCallResult;
            })
            .catch((err: any) => {
                console.log(err?.message);
                return {
                    msg: err?.message,
                    error: `Error calling service: ${err}`,
                };
            });
    }

    public logMeasurement(clientID: string, coachID: string, type: string, value: number, date: number): Promise<RemoteCallResult> {
        console.log(`Using key: ${this.Authorization}`);
        return this.Client.post('/measurement',
            {
                clientID: clientID,
                coachID: coachID,
                data: {
                    date,
                    dataType: type,
                    value,
                },
            },
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': this.Authorization,
                },
            })
            .then((res: any) => {
                return { error: null } as RemoteCallResult;
            })
            .catch((err: any) => {
                return {
                    msg: err?.message,
                    error: `Error calling service: ${err}`,
                };
            });
    }

    public logSurveyResult(clientID: string, date: number, result: QolSurveyResults): Promise<RemoteCallResult> {
        console.log(`Using key: ${this.Authorization}`);
        const data = {
            userId: clientID,
            data: {
                date,
                result,
            },
        };

        console.log(data);
        return this.Client.post('/survey',
        data,
        {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': this.Authorization,
            },
        })
        .then((res: any) => {
            return { error: null } as RemoteCallResult;
        })
        .catch((err: any) => {
            return {
                msg: err?.message,
                error: `Error calling service: ${err}`,
            };
        });
    }

    public pingTest():  Promise<RemoteCallResult> {
        console.log(`Using key: ${this.Authorization}`);
        return this.Client._get('/',
        {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': this.Authorization,
            },
        })
            .then((res: any) => {
                return { error: null } as RemoteCallResult;
            })
            .catch((err: any) => {
                return {
                    msg: err?.message,
                    error: `Error calling service: ${err}`,
                };
            });
    }
}
