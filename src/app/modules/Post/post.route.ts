import express, { NextFunction, Request, Response } from 'express';
import { createPostController, getAllPostsController, updateLikeController } from './post.controller';
import auth from '../../middlewares/auth';
import { USER_ROLE } from '../User/user.constant';
import { upload } from '../../utils/IMGUploader';

const router = express.Router();


router.post('/create',   auth(USER_ROLE.superAdmin, USER_ROLE.admin, USER_ROLE.manager, USER_ROLE.moderator),
  upload.array('files', 5), 
  (req: Request, res: Response, next: NextFunction) => {
    req.body = JSON.parse(req.body.data)
    next()
  }, createPostController)


  router.get('/getAllPosts', auth(USER_ROLE.superAdmin, USER_ROLE.admin, USER_ROLE.manager, USER_ROLE.moderator), getAllPostsController)

  router.patch('/like/:postId', auth(USER_ROLE.superAdmin, USER_ROLE.admin, USER_ROLE.manager, USER_ROLE.moderator), updateLikeController)

export const postRoutes = router;