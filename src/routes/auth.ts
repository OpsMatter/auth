import express from 'express';
import { loginHandler, completeHandler } from '../controllers/auth';
import { validate } from '../middlewares/validate';
import * as userSchema from '../schemas/user';

const router = express.Router();

router.post('/login', validate(userSchema.login), loginHandler);

router.get('/complete', validate(userSchema.complete), completeHandler);

export default router;
