import { MongoMemoryServer } from 'mongodb-memory-server';
import request from 'supertest';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import { app } from '../app';

declare global {
	namespace NodeJS {
		interface Global {
			signin(id?: string): string[];
		}
	}
}

jest.mock('../nats-wrapper.ts');

let mongo: any;
// before execute all test
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

// before execute each test
beforeEach(async () => {
	jest.clearAllMocks();
	const collections = await mongoose.connection.db.collections();

	for (let collection of collections) {
		await collection.deleteMany({});
	}
});

// After execute all test
afterAll(async () => {
	await mongo.stop();
	await mongoose.connection.close();
});

global.signin = (id?: string) => {
	// Build a JWT payload {id, email}
	const payload = {
		id: id || new mongoose.Types.ObjectId().toHexString(),
		email: 'test@test.com'
	};
	// Create JWT
	const token = jwt.sign(payload, process.env.JWT_KEY!);
	// Build session Object { jwt: MY_JWT }
	const session = { jwt: token };
	// Turn that session into JSON
	const sessionJson = JSON.stringify(session);
	// Take JSON and encode it as base64
	const base64 = Buffer.from(sessionJson).toString('base64');
	// return a string that the cookie with the encoded data
	return [ `express:sess=${base64}` ];
};
