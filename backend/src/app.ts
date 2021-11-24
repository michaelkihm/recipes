import bodyParser from 'body-parser';
import { config } from 'dotenv';
import express from 'express';
import { connect } from 'mongoose';
import { recipeRouter } from './routes/recipes.routes';
import { userRouter } from './routes/user.routes';


config({ path: `${process.cwd()}/.env` });

export const app = express();

// eslint-disable-next-line max-len
connect(`mongodb://${process.env.MONGO_INITDB_ROOT_USERNAME}:${process.env.MONGO_INITDB_ROOT_PASSWORD}@localhost:27017/admin`)
  .then(() => console.log('Connected to Database'))
  .catch(err => console.log(err));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use('/images', express.static('backend/images'));

app.use((_req, res, next) => {
	res.setHeader('Access-Control-Allow-Origin','*');
	res.setHeader(
    	'Access-Control-Allow-Headers',
    	'Origin, X-Requested-With, Content-Type, Accept, Authorization');
	res.setHeader(
		'Access-Control-Allow-Methods',
		'GET, POST, PUT, DELETE, OPTIONS');
	next();
});

app.use('/api/recipes',recipeRouter);
app.use('/api/user', userRouter);

export const server = app.listen('4000');