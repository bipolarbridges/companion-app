import Axios from 'axios';
import { IBackendClient } from 'common/abstractions/controlllers/IBackendController';
import BackendControllerBase from '../../../../common/controllers/BackendController';

const API_KEY = 'apikey1';

export class FunctionBackendController extends BackendControllerBase {

    private ax: any;

    constructor() {
        super();
        this.ax = Axios.create({
            baseURL: 'http://127.0.0.1:8888', // TODO
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