import {
    IBackendClient,
    IBackendController, RemoteCallResult,
} from '../abstractions/controlllers/IBackendController';

export default abstract class BackendControllerBase implements IBackendController {

    protected abstract get Client(): IBackendClient;
    protected abstract get Authorization(): string;

    public logNewAccount
    (clientID: string, coachID: string)
    : Promise<RemoteCallResult> {
        return this.Client.post('/account',
            { clientID, coachID },
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
                    error: `Error calling service: ${err}`,
                };
            });
    }

    public logMeasurement
    (clientID: string, coachID: string, type: string, value: number, date: number)
    : Promise<RemoteCallResult> {
        return this.Client.post('/measurement',
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
                    'Authorization': this.Authorization,
                },
            })
            .then((res: any) => {
                return { error: null } as RemoteCallResult;
            })
            .catch((err: any) => {
                return {
                    error: `Error calling service: ${err}`,
                };
            });
    }

}