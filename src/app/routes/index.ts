import { Router } from 'express'
import { StudentRoutes } from '../modules/Student/student.route'
import { UserRoutes } from '../modules/User/user.route'
import { HallRoutes } from '../modules/Hall/hall.route'
import { DiningRoutes } from '../modules/Dining/dining.route'
import { MealRoutes } from '../modules/Meal/meal.route'
import { academicFacultyRoutes } from '../modules/AcademicFaculty/academicFaculty.route'
import { academicDepartmentRoutes } from '../modules/AcademicDepartment/academicDepartment.route'
import { AuthRoutes } from '../modules/Auth/auth.route'

const router = Router()

const moduleRoutes = [
  {
    path: '/hall',
    route: HallRoutes,
  },
  {
    path: '/users',
    route: UserRoutes,
  },
  {
    path: '/students',
    route: StudentRoutes,
  },
  {
    path: '/academic-faculties',
    route: academicFacultyRoutes,
  },
  {
    path: '/academic-department',
    route: academicDepartmentRoutes,
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
