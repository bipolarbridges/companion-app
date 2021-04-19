import { createNewEmailUser, clearAllUsers } from '../../util/auth';

/*
*   Fixture database for user data
*/

export type User = {
    email:      string,
    password:   string,
};

type UserRecord = {
    user: User,
    id: string,
};

const database: UserRecord[] = [

    { user: { email: 'user0@test.com', password: 'secret0' }, id: null },
    { user: { email: 'user1@test.com', password: 'secret1' }, id: null },

];

export async function create() {
    console.log('Creating users...');
    await Promise.all(database.map((u): Promise<void> => new Promise(async (resolve, reject) => {
        try {
            const id: string = await createNewEmailUser(u.user);
            if (!id) {
                throw new Error("nil id");
            } else {
                u.id = id;
                resolve();
            }
        } catch (err) {
            reject(`error creating user database: ${err}`);
        }
    })));
}

export async function clear() {
    console.log('Deleting users...');
    const result = await clearAllUsers();
    if (!result) {
        throw new Error('error clearing user database');
    }
}

export function getUser(idx: number = 0): User {
    if (idx >= database.length) {
        throw new Error('user database index is invalid');
    } else {
        return database[idx].user;
    }
}

export function getId(idx: number = 0): string {
    if (idx >= database.length) {
        throw new Error('user database index is invalid');
    } else {
        return database[idx].id;
    }
}
