import bodyParser from 'body-parser';
import express from 'express';
import { recipeRouter } from './routes/recipes';

const app = express();

app.use(bodyParser.json());

app.use('/api/recipes',recipeRouter);

app.listen('4000');