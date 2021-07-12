import Collections from 'common/database/collections';
import { DocumentSnapshot, Query } from './dbProvider';
import { GenericRepo } from '.';
import { Affirmation } from '../../../mobile/src/constants/QoL';
import { Maybe } from 'common/abstractions/structures/monads';

export default class AffirmationRepo extends GenericRepo<Affirmation> {

    get collectionName() {
        return Collections.Affirmations;
    }

    async getByDomain(domains: string[], keywordFilter: string[]): Promise<Maybe<Affirmation[]>> {
        const query: Query = this.collection
            .where(nameof<Affirmation>(a => a.domains), 'array-contains-any', domains);
        const docs: DocumentSnapshot[] = (await query.get()).docs;
        if (docs.length < 1) {
            return null;
        } else {
            const data = docs.map((af) => {return af.data() as Affirmation; });
            return data.filter((af) => {
                return !af.keywords.some(r => keywordFilter.includes(r));
            });
        }
    }
}