import { Router } from 'express';
import { requireAuth } from '../middleware/auth';
import {
createPost,
listPosts,
getPost,
updatePost,
deletePost,
addComment
} from '../controllers/postController';


const router = Router();


router.get('/', listPosts);
router.post('/', requireAuth, createPost);
router.get('/:slug', getPost);
router.put('/:id', requireAuth, updatePost);
router.delete('/:id', requireAuth, deletePost);
router.post('/:id/comments', requireAuth, addComment);


export default router;
