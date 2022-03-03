/* eslint-disable @typescript-eslint/no-explicit-any */
import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";
import MainTeacher from "../views/teacher/MainTeacher.vue";
import MainStudent from "../views/student/MainStudent.vue";
import CourseList from "../views/shared/CourseList.vue";
import TeacherCourseDashboard from "../views/teacher/CourseDashboard.vue";
import StudentCourseDashboard from "../views/student/CourseDashboard.vue";
import CourseExercises from "../views/teacher/CourseExercises.vue";
import CourseExams from "../views/teacher/CourseExams.vue";
import CoursePermissions from "../views/teacher/CoursePermissions.vue";
import EventEditor from "../components/teacher/EventEditor/EventEditor.vue";
import EventParticipationPage from "../views/student/EventParticipationPage.vue";
import EventParticipationFull from "../views/shared/EventParticipationFull.vue";
import ExamPreview from "../views/student/ExamPreview.vue";
import EventParticipationsMonitor from "../views/teacher/EventParticipationsMonitor.vue";
import Login from "../views/Login.vue";
import CourseCreationForm from "../views/teacher/CourseCreationForm.vue";
import {
  courseDashboardSidebarOptions,
  courseListSidebarOptions,
} from "@/navigation/sidebar";
import { getTranslatedString as _ } from "@/i18n";
import store from "@/store";
import { SharedState } from "@/store/types";
import {
  courseDashBoardBreadCrumbs,
  courseListBreadCrumbs,
  examAssessmentBreadCrumbs,
  examParticipationBreadCrumbs,
  practiceParticipationBreadCrumbs,
  practiceReviewBreadCrumbs,
  submissionReviewBreadCrumbs,
} from "@/navigation/breadcrumbs";

const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    name: "Main",
    component: MainStudent,
    meta: {
      // TODO permissions
      routeTitle: _("headings.login"),
      hideBreadcrumbs: true,
    },
    children: [
      {
        path: "/login",
        name: "Login",
        component: Login,
      },
    ],
  },
  {
    path: "/teacher",
    name: "MainTeacher",
    component: MainTeacher,
    redirect: { name: "TeacherCourseList" },
    meta: {
      // TODO permissions
    },
    children: [
      {
        path: "courses",
        name: "TeacherCourseList",
        component: CourseList,
        meta: {
          routeTitle: _("headings.course_list"),
          sidebarOptions: courseListSidebarOptions,
        },
      },
      {
        path: "courses/create",
        name: "CourseCreationForm",
        component: CourseCreationForm,
        meta: {
          routeTitle: _("headings.new_course"),
          sidebarOptions: courseListSidebarOptions,
        },
      },
      {
        path: "courses/:courseId",
        name: "TeacherCourseDashboard",
        component: TeacherCourseDashboard,
        meta: {
          routeTitle: _("headings.course_dashboard"),
          sidebarOptions: courseDashboardSidebarOptions,
        },
        props: true,
      },
      {
        path: "courses/:courseId/permissions",
        name: "CoursePermissions",
        component: CoursePermissions,
        meta: {
          routeTitle: _("headings.course_permissions"),
          sidebarOptions: courseDashboardSidebarOptions,
        },
      },
      {
        path: "courses/:courseId/exercises",
        name: "CourseExercises",
        component: CourseExercises,
        meta: {
          routeTitle: _("headings.course_exercises"),
          sidebarOptions: courseDashboardSidebarOptions,
        },
      },
      {
        path: "courses/:courseId/exams",
        name: "CourseExams",
        component: CourseExams,
        meta: {
          routeTitle: _("headings.course_exams"),
          sidebarOptions: courseDashboardSidebarOptions,
        },
      },
      {
        path: "courses/:courseId/exams/:examId",
        component: EventEditor,
        name: "ExamEditor",
        meta: {
          sidebarOptions: courseDashboardSidebarOptions,
        },
      },
      {
        path: "courses/:courseId/exams/:examId/progress",
        component: EventParticipationsMonitor,
        name: "ExamProgress",
        meta: {
          sidebarOptions: courseDashboardSidebarOptions,
          routeTitle: _("headings.exam_progress"),
        },
      },
      {
        path: "courses/:courseId/exams/:examId/results",
        component: EventParticipationsMonitor,
        name: "ExamResults",
        props: {
          refreshData: false,
          allowEdit: true,
        },
        meta: {
          sidebarOptions: courseDashboardSidebarOptions,
          routeTitle: _("headings.exam_results"),
        },
      },
    ],
  },
  {
    path: "/student",
    name: "MainStudent",
    component: MainStudent,
    redirect: { name: "StudentCourseList" },
    meta: {
      // TODO permissions
    },
    children: [
      {
        path: "courses",
        name: "StudentCourseList",
        component: CourseList,
        meta: {
          routeTitle: _("headings.course_list"),
          breadcrumbs: courseListBreadCrumbs,
        },
      },
      {
        path: "courses/:courseId",
        name: "StudentCourseDashboard",
        component: StudentCourseDashboard,
        meta: {
          routeTitle: _("headings.course_title"),
          breadcrumbs: courseDashBoardBreadCrumbs,
        },
      },
      {
        path: "courses/:courseId/exams/:examId",
        component: ExamPreview,
        name: "ExamParticipationPreview",
        meta: {
          routeTitle: _("headings.exam_preview"),
          breadcrumbs: examParticipationBreadCrumbs,
        },
      },
      {
        path: "courses/:courseId/exams/:examId/participate",
        component: EventParticipationPage,
        name: "ExamParticipationPage",
        meta: {
          routeTitle: _("headings.ongoing_exam"),
          breadcrumbs: examParticipationBreadCrumbs,
        },
      },
      {
        path: "courses/:courseId/practice/:examId",
        component: EventParticipationPage,
        name: "PracticeParticipationPage",
        meta: {
          routeTitle: _("headings.ongoing_practice"),
          breadcrumbs: practiceParticipationBreadCrumbs,
        },
      },
      {
        path: "courses/:courseId/exams/:examId/review/:participationId",
        component: EventParticipationFull,
        name: "SubmissionReviewPage",
        meta: {
          routeTitle: _("headings.review_submission"),
          breadcrumbs: submissionReviewBreadCrumbs,
        },
        props: true,
      },
      {
        path: "courses/:courseId/exams/:examId/assessment/:participationId",
        component: EventParticipationFull,
        name: "AssessmentReviewPage",
        meta: {
          routeTitle: _("headings.review_assessment"),
          breadcrumbs: examAssessmentBreadCrumbs,
        },
        props: {
          showAssessment: true,
        },
      },
      {
        path: "courses/:courseId/practice/:examId/summary/:participationId",
        component: EventParticipationFull,
        name: "PracticeSummaryPage",
        meta: {
          routeTitle: _("headings.practice_summary"),
          breadcrumbs: practiceReviewBreadCrumbs,
        },
        props: {
          showAssessment: true,
        },
      },
    ],
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

router.beforeEach((to, from) => {
  const sharedState = (store.state as { shared: SharedState }).shared;

  if (store.getters.unsavedChanges) {
    if (!confirm(_("misc.confirm_exiting_unsaved_changes"))) {
      return false;
    } else {
      sharedState.saving = false;
      sharedState.savingError = false;
    }
  }
});

router.afterEach(() => {
  const sharedState = (store.state as { shared: SharedState }).shared;
  sharedState.pageWideErrorData = null;
});

export default router;
