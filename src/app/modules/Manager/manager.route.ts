import express from 'express'
import {
  deleteManagerController,
  getManagersController,
  getSingleManagerController,
  updateManagerController,
} from './manager.controller'

const router = express.Router()

router.get('/getManagers', getManagersController)
router.delete('/:managerId', deleteManagerController)
router.get('/:managerId', getSingleManagerController)
router.patch('/:managerId', updateManagerController)

export const ManagerRoutes = router
