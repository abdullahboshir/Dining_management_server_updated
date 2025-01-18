import { Router } from 'express'
import { UserRoutes } from '../modules/User/user.route'
import { academicFacultyRoutes } from '../modules/academicFaculty/academicFaculty.route'
import { academicDepartmentRoutes } from '../modules/academicDepartment/academicDepartment.route'
import { DiningRoutes } from '../modules/Dining/dining.route'
import { StudentRoutes } from '../modules/Student/student.route'

const router = Router()

const moduleRoutes = [
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
]

moduleRoutes.forEach((route) => router.use(route.path, route.route))

export default router
