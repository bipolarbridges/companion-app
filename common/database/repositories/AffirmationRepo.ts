import Collections from 'common/database/collections';
import { DocumentSnapshot, Query } from './dbProvider';
import { GenericRepo } from '.';
import { Affirmation } from '../../../mobile/src/constants/QoL';
import { Maybe } from 'abstractions/structures/monads';

export default class AffirmationRepo extends GenericRepo<Affirmation> {

    get collectionName() {
        return Collections.Affirmations;
    }

    async getByDomain(domains: string[], keywordFilter?: string[]):Promise<Maybe<Affirmation[]>> {
        const query: Query = this.collection
            .where(nameof<Affirmation>(a => a.domains), 'array-contains-any', domains);
        const docs: DocumentSnapshot[] = (await query.get()).docs;
        if (docs.length < 1) {
            return null;
        } else {
            const data = docs.map((af) => {return af.data() as Affirmation });
            let result = data;
            if (keywordFilter && keywordFilter.length > 0) {
                result = data.filter((af) => {
                    !af.keywords.some(r=> keywordFilter.includes(r))
                });
            }
            return result;
        }
    }
}