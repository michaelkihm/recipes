import { User } from '../models/user.model';

export const user1Id = '137ce4177ef1da711f08a4f6';
export const user2Id = '1cf1dec6b41f85794acd20bc';

export const USERS: User[] = [
    {
        email: 'test@test.com',
        password: '$2a$10$2SQakBtWJ5tsA7uvjGbKleKO5GVNW81azMQFL1pS8FI/t6jIEp.qy', //123
        id: user1Id,
        username: 'User1',
        bookmarks: ['6151e30732820d7c71705f24', '6151e318a81f71122c95f756'],
        image: 'http://localhost:4000/images/User1.png',
    },
    {
        email: '12@gmail.com',
        password: '$2a$10$wBpfAp3AFivfqxwyUBjS6e2ZH6KHXDaZYHjQEUYf87p8/i.nZ/wtO', //234
        id: user2Id,
        username: 'Slow Cook',
        bookmarks: []
    }
];