import { Router } from 'express';
import auth from './auth';
import posts from './posts';
import users from './users';


const router = Router();


router.use('/auth', auth);
router.use('/posts', posts);
router.use('/users', users);


export default router;
