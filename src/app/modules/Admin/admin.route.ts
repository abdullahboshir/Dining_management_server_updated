import express from 'express'
import {
  deleteAdminController,
  getAllAdminController,
  getSingleAdminController,
  updateAdminController,
} from './admin.controller'

const router = express.Router()

router.get('/getAllAdmin', getAllAdminController)
router.delete('/:adminId', deleteAdminController)
router.get('/:adminId', getSingleAdminController)
router.patch('/:adminId', updateAdminController)

export const AdminRoutes = router
