/* eslint-disable @typescript-eslint/no-explicit-any */
import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";
import MainTeacher from "../views/teacher/MainTeacher.vue";
import MainStudent from "../views/student/MainStudent.vue";
import CourseList from "../views/shared/CourseList.vue";
import TeacherCourseDashboard from "../views/teacher/CourseDashboard.vue";
import StudentCourseDashboard from "../views/student/CourseDashboard/Main.vue";
import CourseDashBoardExamList from "../views/student/CourseDashboard/ExamsList.vue";
import CourseDashBoardPracticeSessionList from "../views/student/CourseDashboard/PracticeList.vue";
import CourseDashBoardExerciseThreadList from "../views/student/CourseDashboard/ExerciseThreadList.vue";
import FavoriteContentsList from "../views/student/CourseDashboard/FavoriteContentsList.vue";
//import StudentCourseDashboard from "../views/student/CourseDashboard.vue";
import CourseExercises from "../views/teacher/CourseExercises.vue";
import CourseTree from "../views/course_tree/CourseTree.vue";
import NodeDetail from "../views/course_tree/NodeDetail.vue";
import CourseExams from "../views/teacher/CourseExams.vue";
import CourseInsights from "../views/teacher/CourseInsights.vue";
import CoursePermissions from "../views/teacher/CoursePermissions.vue";
import EventEditor from "../components/teacher/EventEditor/EventEditor.vue";
import EventParticipationPage from "../views/student/EventParticipationPage.vue";
import EventParticipationFull from "../views/shared/EventParticipationFull.vue";
import ExamPreview from "../views/student/ExamPreview.vue";
import ExerciseSolutionThread from "../views/student/ExerciseSolutionThread.vue";
import EventParticipationsMonitor from "../views/teacher/EventParticipationsMonitor.vue";
import CourseExerciseSolutionThreads from "../views/teacher/CourseExerciseSolutionThreads.vue";
import DetailExerciseSolutionThreads from "../views/teacher/DetailExerciseSolutionThreads.vue";
import GamificationLeaderboard from "../views/shared/GamificationLeaderboard.vue";
import EventStats from "../views/teacher/EventStats.vue";
import Login from "../views/Login.vue";
import PageNotFound from "../views/shared/PageNotFound.vue";
import CourseCreationForm from "../views/teacher/CourseCreationForm.vue";
import {
	courseDashboardSidebarOptions,
	courseListSidebarOptions,
	studentCourseListSidebarOptions,
	studentDashboardSidebarOptions,
} from "@/navigation/sidebar";
import { getTranslatedString as _ } from "@/i18n";
import {
	courseDashBoardBreadCrumbs,
	examAssessmentBreadCrumbs,
	examParticipationBreadCrumbs,
	examsListBreadCrumbs,
	exerciseSolutionThreadBreadCrumbs,
	exerciseThreadsBreadCrumbs,
	leaderboardBreadCrumbs,
	practiceParticipationBreadCrumbs,
	practiceReviewBreadCrumbs,
	practicesListBreadCrumbs,
	studentFavoritesBreadCrumbs,
	submissionReviewBreadCrumbs,
} from "@/navigation/breadcrumbs";
import {
	exerciseSolutionThreadBeforeGuard,
	courseTreeNodeDetailBeforeGuard,
	courseTreeBeforeGuard,
} from "./guards";
import { useMetaStore } from "@/stores/metaStore";

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
			// TODO move CourseList here
		],
	},
	{
		path: "/threads/:courseId/:exerciseId/:solutionId",
		name: "ExerciseSolutionThreadDispatcher",
		component: MainStudent,
		beforeEnter: exerciseSolutionThreadBeforeGuard,
	},
	{
		path: "/courses/:courseId/material/:nodeId",
		name: "CourseTreeNodeDetailDispatcher",
		component: MainStudent,
		beforeEnter: courseTreeNodeDetailBeforeGuard,
	},
	{
		path: "/courses/:courseId/material/",
		name: "CourseTreeDispatcher",
		component: MainStudent,
		beforeEnter: courseTreeBeforeGuard,
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
					requireTeacher: true,
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
					requireTeacher: true,
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
				path: "courses/:courseId/material",
				name: "TeacherCourseTree",
				component: CourseTree,
				meta: {
					routeTitle: _("headings.course_tree"),
					sidebarOptions: courseDashboardSidebarOptions,
					tags: ["permissions"],
				},
			},
			{
				path: "courses/:courseId/material/:nodeId",
				name: "TeacherNodeDetail",
				component: NodeDetail,
				meta: {
					//routeTitle: _("headings.course_tree_node"),
					sidebarOptions: courseDashboardSidebarOptions,
					tags: ["permissions"],
				},
			},
			/* end course_tree */
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
			{
				path: "courses/:courseId/threads/",
				component: CourseExerciseSolutionThreads,
				name: "TeacherCourseExerciseSolutionThreads",
				meta: {
					sidebarOptions: courseDashboardSidebarOptions,
					routeTitle: _("headings.exercise_solution_threads"),
					tags: ["exercises", "threads", "solutions"],
				},
			},
			{
				path: "courses/:courseId/threads/:exerciseId/:solutionId?",
				component: DetailExerciseSolutionThreads,
				name: "TeacherDetailExerciseSolutionThreads",
				meta: {
					sidebarOptions: courseDashboardSidebarOptions,
					routeTitle: _("headings.exercise_solution_thread_detail"),
					tags: ["exercises", "threads", "solutions"],
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
					hideBreadcrumbs: true,
					sidebarOptions: studentCourseListSidebarOptions,
				},
			},
			{
				path: "courses/:courseId",
				name: "StudentCourseDashboard",
				component: StudentCourseDashboard,
				meta: {
					routeTitle: _("headings.course_title"),
					breadcrumbs: courseDashBoardBreadCrumbs,
					hideUserInfoFromNav: true,
					sidebarOptions: studentDashboardSidebarOptions,
				},
				redirect: { name: "CourseDashBoardPracticeSessionList" },
				children: [
					{
						path: "exams",
						name: "CourseDashBoardExamList",
						component: CourseDashBoardExamList,
						meta: {
							routeTitle: _("student_course_dashboard.exams_you_participated_in"),
							breadcrumbs: examsListBreadCrumbs,
							sidebarOptions: studentDashboardSidebarOptions,
						},
					},
					{
						path: "practices",
						name: "CourseDashBoardPracticeSessionList",
						component: CourseDashBoardPracticeSessionList,
						meta: {
							routeTitle: _("student_course_dashboard.your_practice_events"),
							breadcrumbs: practicesListBreadCrumbs,
							sidebarOptions: studentDashboardSidebarOptions,
						},
					},
					{
						path: "threads",
						name: "CourseDashBoardExerciseThreadList",
						component: CourseDashBoardExerciseThreadList,
						meta: {
							routeTitle: _("headings.student_exercise_solution_threads"),
							breadcrumbs: exerciseThreadsBreadCrumbs,
							sidebarOptions: studentDashboardSidebarOptions,
						},
					},
					{
						path: "leaderboard",
						name: "StudentCourseLeaderboard",
						component: GamificationLeaderboard,
						meta: {
							routeTitle: _("headings.student_course_leaderboard"),
							breadcrumbs: leaderboardBreadCrumbs,
							sidebarOptions: studentDashboardSidebarOptions,
						},
					},
					{
						path: "favorites",
						name: "StudentFavorites",
						component: FavoriteContentsList,
						meta: {
							routeTitle: _("headings.student_favorites"),
							breadcrumbs: studentFavoritesBreadCrumbs,
							sidebarOptions: studentDashboardSidebarOptions,
						},
					},
					{
						path: "material",
						name: "StudentCourseTree",
						component: CourseTree,
						meta: {
							// routeTitle: _("headings.student_favorites"),
							// breadcrumbs: studentFavoritesBreadCrumbs,
							sidebarOptions: studentDashboardSidebarOptions,
						},
					},
					{
						path: "material/:nodeId",
						name: "StudentNodeDetail",
						component: NodeDetail,
						meta: {
							// routeTitle: _("headings.student_favorites"),
							// breadcrumbs: studentFavoritesBreadCrumbs,
							sidebarOptions: studentDashboardSidebarOptions,
						},
					},
					{
						path: "threads/:exerciseId/:solutionId?",
						name: "ExerciseSolutionThread",
						component: ExerciseSolutionThread,
						meta: {
							routeTitle: _("headings.student_exercise_solution_thread"),
							breadcrumbs: exerciseSolutionThreadBreadCrumbs,
							sidebarOptions: studentDashboardSidebarOptions,
						},
					},
				],
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

// router.beforeEach((to, from, next) => {
// 	console.log({ to, from });
// 	next();
// });

router.beforeEach((to, from, next) => {
	const metaStore = useMetaStore();

	if (metaStore.unsavedChanges) {
		if (!confirm(_("misc.confirm_exiting_unsaved_changes"))) {
			return false;
		} else {
			metaStore.saving = false;
			metaStore.savingError = false;
		}
	}
	if (!metaStore.isAuthenticated && to.name !== "Login") {
		next({ name: "Login", query: { redirect: to.fullPath } });
	} else if (to.meta.requireTeacher && !metaStore.user.is_teacher) {
		// TODO redirect to CourseList
		next({ name: "StudentCourseList" });
	} else {
		next();
	}
});

router.afterEach(() => {
	const metaStore = useMetaStore();
	metaStore.pageWideErrorData = null;
});

export default router;
