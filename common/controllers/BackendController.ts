// import { QolSurveyResults } from '../models/QoL';
import {
    IBackendClient,
    IBackendController, RemoteCallResult,
} from '../abstractions/controlllers/IBackendController';
import axios, { AxiosError } from 'axios'
export default abstract class BackendControllerBase implements IBackendController {

    protected abstract get Client(): IBackendClient;
    protected abstract get Authorization(): string;

    public logNewAccount(id: string): Promise<RemoteCallResult> {
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

    
    public logMeasurement(clientID: string, source: string, subtype: string, value: number, date: number): Promise<RemoteCallResult> {
        console.log(`Using key: ${this.Authorization}`);
        const data: PostedLog = {
            clientID,
            data: {
                date,
                subtype,
                value,
                source,
            },
        }
        return this.Client.post('/measurement',
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
            .catch((err: (Error | AxiosError)) => {
                if (axios.isAxiosError(err))  {
                    return {
                        msg: err.message,
                        res: err.response,
                        jsoned: err.toJSON(),
                        error: `Error calling service: ${err}`,
                    }
                } else {
                    return {
                        error: `Error calling service: ${err}`,
                    };
                }
                
            });
    }
}

export type PostedLog = {
    clientID: string,
    data: SurveyPiece,
}

export type SurveyPiece = {
    subtype: string;
    value: number;
    date: number;
    source: string;
};