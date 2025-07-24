import express, { NextFunction, Request, Response } from 'express';
import { createPostController, getAllPostsController, updateBookmarkController, updateLikeController } from './post.controller';
import auth from '../../middlewares/auth';
import { USER_ROLE } from '../User/user.constant';
import { upload } from '../../utils/IMGUploader';

const router = express.Router();


router.post('/create',   auth(USER_ROLE.superAdmin, USER_ROLE.admin, USER_ROLE.manager, USER_ROLE.moderator, USER_ROLE.student),
  upload.array('files', 5), 
  (req: Request, res: Response, next: NextFunction) => {
    req.body = JSON.parse(req.body.data)
    next()
  }, createPostController)


  router.get('/getAllPosts', getAllPostsController)

  router.patch('/like/:postId', auth(USER_ROLE.superAdmin, USER_ROLE.admin, USER_ROLE.manager, USER_ROLE.moderator, USER_ROLE.student), updateLikeController)


  router.patch('/:postId', auth(USER_ROLE.superAdmin, USER_ROLE.admin, USER_ROLE.manager, USER_ROLE.moderator, USER_ROLE.student), updateBookmarkController)

export const postRoutes = router;