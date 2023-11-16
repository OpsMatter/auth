import express from 'express';
import { getMeHandler } from '../controllers/user';
import { deserialiseUser } from '../middlewares/deserialiseUser';
import { requireUser } from '../middlewares/requireUser';

const router = express.Router();

router.use(deserialiseUser, requireUser);

router.get('/me', getMeHandler);

export default router;
