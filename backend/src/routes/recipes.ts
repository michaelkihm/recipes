import { Router } from 'express';


export const recipeRouter = Router();

recipeRouter.get('',(req, res) => {
    res.status(200).json({ message: 'Backend here' });
});

