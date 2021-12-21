import {
  createRouter,
  createWebHistory,
  RouteRecordRaw,
} from 'vue-router';
import MainTeacher from '../views/teacher/MainTeacher.vue';
import CourseList from '../views/teacher/CourseList.vue';
import CourseDashboard from '../views/teacher/CourseDashboard.vue';
import CourseExercises from '../views/teacher/CourseExercises.vue';
import CourseExams from '../views/teacher/CourseExams.vue';
import CourseHeadView from '../views/CourseHeadView.vue';

import {
  courseDashboardSidebarOptions,
  courseListSidebarOptions,
} from '@/navigation/sidebar';
import { getTranslatedString as _ } from '@/i18n';

const routes: Array<RouteRecordRaw> = [
  {
    path: '/teacher',
    name: 'MainTeacher',
    component: MainTeacher,
    redirect: { name: 'CourseList' },
    meta: {
      // TODO permissions
    },
    children: [
      {
        path: 'courses',
        name: 'CourseList',
        component: CourseList,
        meta: {
          sidebarOptions: courseListSidebarOptions,
        },
      },
      {
        path: 'courses/:id',
        component: CourseHeadView,
        meta: {
          sidebarOptions: courseDashboardSidebarOptions,
        },
        children: [
          {
            path: '',
            name: 'CourseDashboard',
            component: CourseDashboard,
          },
          {
            path: 'exercises',
            name: 'CourseExercises',
            component: CourseExercises,
            meta: {
              routeTitle: _('headings.course_exercises'),
            },
          },
          {
            path: 'exams',
            name: 'CourseExams',
            component: CourseExams,
          },
        ],
      },
    ],
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
