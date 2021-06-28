import GenericUserRepo from './GenericUserRepo';
import Collections from 'common/database/collections';
import { ClientJournalEntryIded, ClientJournalEntry, JournalRecordDataIded } from 'common/models';

export default class CheckinResultsRepo extends GenericUserRepo<ClientJournalEntry> {

    get collectionName() {
        return Collections.Checkin;
    }

    async addEntry(userId: string, entry: ClientJournalEntry) {
        await this.createUserData(userId, entry);
    }

}