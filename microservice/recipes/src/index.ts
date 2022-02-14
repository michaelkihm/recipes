	import mongoose from 'mongoose';
import { app } from './app';
import { natsWrapper } from './nats-wrapper';

const start = async () => {
  if (!process.env.JWT_KEY) {
    throw new Error('JWT_KEY must be defined');
  }


  try {
		await natsWrapper.connect(
			process.env.NATS_CLUSTER_ID!,
			process.env.NATS_CLIENT_ID!,
			`http://${process.env.NATS_SRV_SERVICE_HOST}:${process.env.NATS_SRV_SERVICE_PORT}`);
		natsWrapper.client.on('close', () => {
			console.log('NATS connection closed');
			process.exit();
		});
		process.on('SIGINT', () => natsWrapper.client.close());
		process.on('SIGTERM', () => natsWrapper.client.close());
		
		await mongoose.connect(
		`mongodb://${process.env.RECIPES_MONGO_SRV_SERVICE_HOST}:${process.env.RECIPES_MONGO_SRV_SERVICE_PORT}/recipes`,
		{
			useNewUrlParser: true,
			useUnifiedTopology: true,
			useCreateIndex: true,
			useFindAndModify: false,
		});

		if( !('recipes' in mongoose.connection.collections) ) {
			const recipes = await mongoose.connection.createCollection('recipes');
			await recipes.createIndex({ name: 'text', description: 'text' });
		}
		
    	console.log('Connected to MongoDb');

  } catch (err) {
    console.error(err);
  }

  app.listen(3001, () => {
    console.log('Listening on port 3001');
  });
};

start();
