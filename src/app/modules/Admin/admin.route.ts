import express from 'express'
import { getManagersController } from '../Manager/manager.controller'
import {
  deleteAdminController,
  getAllAdminController,
} from './admin.controller'

const router = express.Router()

router.get('/getAllAdmin', getAllAdminController)
router.delete('/:adminId', deleteAdminController)

export const AdminRoutes = router
