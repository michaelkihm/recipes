import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import fs from 'fs';
import path from 'path';
import { signupUser } from '../routes/__test__/shared/signup-user';
import { UserStrings } from '@mickenhosrecipes/common';

declare global {
  // eslint-disable-next-line no-var
  var signin: () => Promise<string[]>;
}

let mongo: MongoMemoryServer;
beforeAll(async () => {
  process.env.JWT_KEY = 'asdfasdf';
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

  mongo = new MongoMemoryServer();
  const mongoUri = await mongo.getUri();

  await mongoose.connect(mongoUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  });
});

beforeEach(async () => {
  const collections = await mongoose.connection.db.collections();

  for (const collection of collections) {
    await collection.deleteMany({});
  }
});

afterAll(async () => {
  await mongo.stop();
  await mongoose.connection.close();
  removeTestImages();
});

global.signin = async () => {

  const newUser: UserStrings = {
    email: 'test@test.com',
    password: 'password',
    username: 'username',
  };
  
  const response = await signupUser(newUser);

  const cookie = response.get('Set-Cookie');

  return cookie;
};

const removeTestImages = ( ) => {
    
  const imagePath = './images';
  fs.readdir(imagePath, (err, files) => {
  
      files.forEach(file => {
          const fileDir = path.join(imagePath, file);
          if (file !== 'profile-dummy.jpg' && file !== 'identicon.png') {
                fs.unlinkSync(fileDir);
          }
      });
  });
};