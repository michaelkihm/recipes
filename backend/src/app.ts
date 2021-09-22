import bodyParser from 'body-parser';
import express from 'express';
import { recipeRouter } from './routes/recipes';

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

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

app.listen('4000');