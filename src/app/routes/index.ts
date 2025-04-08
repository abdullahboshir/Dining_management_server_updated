import { Router } from 'express'
import { StudentRoutes } from '../modules/Student/student.route'
import { UserRoutes } from '../modules/User/user.route'
import { HallRoutes } from '../modules/Hall/hall.route'
import { DiningRoutes } from '../modules/Dining/dining.route'
import { MealRoutes } from '../modules/Meal/meal.route'
import { AuthRoutes } from '../modules/Auth/auth.route'
import { ManagerRoutes } from '../modules/Manager/manager.route'
import { AdminRoutes } from '../modules/Admin/admin.route'
import { NoticeRoutes } from '../modules/Notice/notice.route'

const router = Router()

const moduleRoutes = [
  {
    path: '/hall',
    route: HallRoutes,
  },
  {
    path: '/notice',
    route: NoticeRoutes,
  },
  {
    path: '/user',
    route: UserRoutes,
  },
  {
    path: '/student',
    route: StudentRoutes,
  },
  {
    path: '/manager',
    route: ManagerRoutes,
  },
  {
    path: '/admin',
    route: AdminRoutes,
  },
  {
    path: '/dining',
    route: DiningRoutes,
  },
  {
    path: '/meal',
    route: MealRoutes,
  },
  {
    path: '/auth',
    route: AuthRoutes,
  },
]

moduleRoutes.forEach((route) => router.use(route.path, route.route))

export default router
