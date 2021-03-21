export type DomainMagnitudesData = {
    [dom: string]: number
};

export interface IBackendController {

    getDomainMagnitudes(): Promise<DomainMagnitudesData>;

    setDomainMagnitudes(magnitudes: any): Promise<boolean>;
}