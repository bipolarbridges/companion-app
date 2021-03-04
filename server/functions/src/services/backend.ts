import Axios from 'axios';
import { IBackendClient } from 'common/abstractions/controlllers/IBackendController';
import BackendControllerBase from '../../../../common/controllers/BackendController';
import { BackendSettings as config } from './config';

const API_KEY = 'apikey1';

export class FunctionBackendController extends BackendControllerBase {

    private ax: any;

    constructor() {
        super();
        this.ax = Axios.create({
            baseURL: `${config.prot}://${config.addr}:${config.port}`,
        });
    }

    protected get Client(): IBackendClient {
        return {
            post: this.ax.post,
        };
    }

    protected get Authorization(): string {
        return API_KEY;
    }

}