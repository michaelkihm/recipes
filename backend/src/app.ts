import bodyParser from 'body-parser';
import express from 'express';
import { connect } from 'mongoose';
import { recipeRouter } from './routes/recipes.routes';

const testDBPath = 'mongodb://root:rootpassword@localhost:27017/admin';

export const app = express();

connect(testDBPath)
  .then(() => console.log('Connected to Database'))
  .catch(err => console.log(err));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use('/images', express.static('backend/images'));

app.use((_req, res, next) => {
	res.setHeader('Access-Control-Allow-Origin','*');
	res.setHeader(
    	'Access-Control-Allow-Headers',
    	'Origin, X-Requested-With, Content-Type, Accept');
	res.setHeader(
		'Access-Control-Allow-Methods',
		'GET, POST, PUT, DELETE, OPTIONS');
	next();
});

app.use('/api/recipes',recipeRouter);

export const server = app.listen('4000');