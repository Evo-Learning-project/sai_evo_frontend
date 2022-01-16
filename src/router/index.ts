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
import EventEditor from '../components/teacher/EventEditor/EventEditor.vue';
import CourseHeadView from '../views/CourseHeadView.vue';
import Login from '../views/Login.vue';
import {
  courseDashboardSidebarOptions,
  courseListSidebarOptions,
} from '@/navigation/sidebar';
import { getTranslatedString as _ } from '@/i18n';

const routes: Array<RouteRecordRaw> = [
  {
    path: '/login',
    name: 'Login',
    component: Login,
  },
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
        path: 'courses/:courseId',
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
            meta: {
              routeTitle: _('headings.course_exams'),
            },
          },
          {
            path: 'exams/:examId',
            component: EventEditor,
            name: 'EventEditor',
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
