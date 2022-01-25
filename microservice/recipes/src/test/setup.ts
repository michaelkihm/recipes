import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import fs from 'fs';
import path from 'path';

declare global {
  // eslint-disable-next-line no-var
  var signin: () => string[];
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

	for (const collection of collections)
		await collection.deleteMany({});
	
});

afterAll(async () => {
  await mongo.stop();
  await mongoose.connection.close();
  removeTestImages();
});

global.signin = () => {
	// Build a JWT payload.  { id, email }
	const payload = {
		id: new mongoose.Types.ObjectId().toHexString(),
		email: 'test@test.com',
	};

	// Create the JWT!
	// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
	const token = jwt.sign(payload, process.env.JWT_KEY!);

	// Build session Object. { jwt: MY_JWT }
	const session = { jwt: token };

	// Turn that session into JSON
	const sessionJSON = JSON.stringify(session);

	// Take JSON and encode it as base64
	const base64 = Buffer.from(sessionJSON).toString('base64');

	// return a string thats the cookie with the encoded data
	return [`express:sess=${base64}`];
};


const removeTestImages = ( ) => {
    
    const imagePath = './images';
    fs.readdir(imagePath, (err, files) => {
    
        files.forEach(file => {
            const fileDir = path.join(imagePath, file);
            if (file !== 'recipe-dummy.png' 
				&& file !== 'salmon-g856c1740c_640.jpg' 
				&& file !== 'vegetables-g1e5fb0e84_640.jpg') {
                	fs.unlinkSync(fileDir);
            }
        });
    });
};