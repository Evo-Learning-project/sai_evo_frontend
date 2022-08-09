/* eslint-disable @typescript-eslint/no-explicit-any */
import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";
import MainTeacher from "../views/teacher/MainTeacher.vue";
import MainStudent from "../views/student/MainStudent.vue";
import CourseList from "../views/shared/CourseList.vue";
import TeacherCourseDashboard from "../views/teacher/CourseDashboard.vue";
import StudentCourseDashboard from "../views/student/CourseDashboard.vue";
import CourseExercises from "../views/teacher/CourseExercises.vue";
import CourseExams from "../views/teacher/CourseExams.vue";
import CourseInsights from "../views/teacher/CourseInsights.vue";
import CoursePermissions from "../views/teacher/CoursePermissions.vue";
import EventEditor from "../components/teacher/EventEditor/EventEditor.vue";
import EventParticipationPage from "../views/student/EventParticipationPage.vue";
import EventParticipationFull from "../views/shared/EventParticipationFull.vue";
import ExamPreview from "../views/student/ExamPreview.vue";
import EventParticipationsMonitor from "../views/teacher/EventParticipationsMonitor.vue";
import EventStats from "../views/teacher/EventStats.vue";
import Login from "../views/Login.vue";
import PageNotFound from "../views/shared/PageNotFound.vue";
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
import { getCourse } from "@/api/courses";

const dispatchSolutionView = () => true;

const routes: Array<RouteRecordRaw> = [
	{
		path: "/",
		name: "Main",
		component: MainStudent,
		redirect: { name: "Login" },
		meta: {
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
		path: "/threads/:courseId/:exerciseId/:solutionId",
		name: "SolutionDispatcher",
		component: Login,
		//redirect: { name: "Login" },
		beforeEnter: async (to, _, next) => {
			const course = await getCourse(to.params.courseId as string);
			const privileges = course.privileges ?? [];
			if (privileges.length > 0) {
				next("TeacherSolutions");
			} else {
				next("StudentSolutions");
			}
		},
		// meta: {
		// 	routeTitle: _("headings.login"),
		// 	hideBreadcrumbs: true,
		// },
	},
	{
		path: "/teacher",
		name: "MainTeacher",
		component: MainTeacher,
		meta: {
			teacherRoute: true,
		},
		redirect: { name: "TeacherCourseList" },
		children: [
			{
				path: "courses",
				name: "TeacherCourseList",
				component: CourseList,
				meta: {
					teachersOnly: true,
					routeTitle: _("headings.course_list"),
					sidebarOptions: courseListSidebarOptions,
					tags: ["general"],
				},
			},
			{
				path: "courses/create",
				name: "CourseCreationForm",
				component: CourseCreationForm,
				meta: {
					teachersOnly: true,
					routeTitle: _("headings.new_course"),
					sidebarOptions: courseListSidebarOptions,
					tags: ["general"],
				},
			},
			{
				path: "courses/:courseId",
				name: "TeacherCourseDashboard",
				component: TeacherCourseDashboard,
				meta: {
					routeTitle: _("headings.course_dashboard"),
					sidebarOptions: courseDashboardSidebarOptions,
					tags: ["general"],
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
					tags: ["permissions"],
				},
			},
			{
				path: "courses/:courseId/insights",
				name: "CourseInsights",
				component: CourseInsights,
				meta: {
					routeTitle: _("headings.course_insights"),
					sidebarOptions: courseDashboardSidebarOptions,
					tags: ["general"],
				},
			},
			{
				path: "courses/:courseId/exercises",
				name: "CourseExercises",
				component: CourseExercises,
				meta: {
					routeTitle: _("headings.course_exercises"),
					sidebarOptions: courseDashboardSidebarOptions,
					tags: ["exercises"],
				},
			},
			{
				path: "courses/:courseId/exams",
				name: "CourseExams",
				component: CourseExams,
				meta: {
					routeTitle: _("headings.course_exams"),
					sidebarOptions: courseDashboardSidebarOptions,
					tags: ["exams"],
				},
			},
			{
				path: "courses/:courseId/exams/:examId",
				component: EventEditor,
				name: "ExamEditor",
				meta: {
					sidebarOptions: courseDashboardSidebarOptions,
					tags: ["exams", "exercises", "editor"],
				},
			},
			{
				path: "courses/:courseId/exams/:examId/progress",
				component: EventParticipationsMonitor,
				name: "ExamProgress",
				meta: {
					sidebarOptions: courseDashboardSidebarOptions,
					routeTitle: _("headings.exam_progress"),
					tags: ["exams", "participations"],
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
					tags: ["exams", "participations"],
				},
			},
			{
				path: "courses/:courseId/exams/:examId/stats",
				component: EventStats,
				name: "ExamStats",
				meta: {
					sidebarOptions: courseDashboardSidebarOptions,
					//routeTitle: _("headings.exam_results"),
					tags: ["exams", "participations"],
				},
			},
			{
				path: "courses/:courseId/exams/:examId/participations/:participationId",
				component: EventParticipationFull,
				name: "ExamParticipationFull",
				meta: {
					//routeTitle: _("headings.practice_summary"),
					sidebarOptions: courseDashboardSidebarOptions,
					tags: ["exams", "exercises"],
				},
				props: {
					showAssessmentCard: true,
					allowEditAssessment: true,
				},
			},
		],
	},
	{
		path: "/student",
		name: "MainStudent",
		component: MainStudent,
		redirect: { name: "StudentCourseList" },
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
				path: "courses/:courseId/exams/:examId/review/:participationId/:showSubmissionConfirmationMessage?",
				component: EventParticipationFull,
				name: "SubmissionReviewPage",
				meta: {
					routeTitle: _("headings.review_submission"),
					breadcrumbs: submissionReviewBreadCrumbs,
				},
				props: {
					showSolutionAndScores: false,
				},
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
					showAssessmentCard: true,
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
					showAssessmentCard: true,
				},
			},
			{
				path: "/:catchAll(.*)",
				component: PageNotFound,
			},
		],
	},
];

const router = createRouter({
	scrollBehavior(to, from, savedPosition) {
		// always scroll to top
		return { top: 0 };
	},
	history: createWebHistory(process.env.BASE_URL),
	routes,
});

router.beforeEach((to, from, next) => {
	const sharedState = (store.state as { shared: SharedState }).shared;

	if (store.getters["shared/unsavedChanges"]) {
		if (!confirm(_("misc.confirm_exiting_unsaved_changes"))) {
			return false;
		} else {
			sharedState.saving = false;
			sharedState.savingError = false;
		}
	}
	if (!store.getters["shared/isAuthenticated"] && to.name !== "Login") {
		next({ name: "Login", query: { redirect: to.fullPath } });
	} else if (
		to.meta.teachersOnly &&
		!(store.state as { shared: SharedState }).shared.user.is_teacher
	) {
		next({ name: "StudentCourseList" });
	} else {
		next();
	}
});

router.afterEach(() => {
	const sharedState = (store.state as { shared: SharedState }).shared;
	sharedState.pageWideErrorData = null;
});

export default router;
