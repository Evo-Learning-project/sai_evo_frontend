import { getTranslatedString as _ } from "@/i18n";

export interface BreadCrumb {
	title: string;
	routeName?: string;
	routeParams?: Record<string, PropertyKey>;
}

const courseListBreadCrumb: BreadCrumb = {
	title: _("breadcrumbs.course_list"),
	routeName: "StudentCourseList",
	routeParams: {
		courseId: -1, // !
	},
};

const courseDashBoardBreadCrumb: BreadCrumb = {
	title: _("breadcrumbs.course_dashboard"),
	routeName: "StudentCourseDashboard",
	// routeParams: ["courseId"],
};

export const courseListBreadCrumbs: BreadCrumb[] = [courseListBreadCrumb];

export const courseDashBoardBreadCrumbs: BreadCrumb[] = [
	courseListBreadCrumb,
	courseDashBoardBreadCrumb,
];

export const examsListBreadCrumbs: BreadCrumb[] = [
	courseListBreadCrumb,
	courseDashBoardBreadCrumb,
	{
		title: _("student_dashboard_options.my_exams"),
	},
];

export const practicesListBreadCrumbs: BreadCrumb[] = [
	courseListBreadCrumb,
	courseDashBoardBreadCrumb,
	{
		title: _("student_dashboard_options.my_practice_sessions"),
	},
];

export const examParticipationBreadCrumbs: BreadCrumb[] = [
	courseListBreadCrumb,
	courseDashBoardBreadCrumb,
	{
		title: _("breadcrumbs.exam_participation_page"),
	},
];

export const practiceParticipationBreadCrumbs: BreadCrumb[] = [
	courseListBreadCrumb,
	courseDashBoardBreadCrumb,
	{
		title: _("breadcrumbs.practice_participation_page"),
		routeName: "PracticeParticipationPage",
	},
];

export const submissionReviewBreadCrumbs: BreadCrumb[] = [
	courseListBreadCrumb,
	courseDashBoardBreadCrumb,
	{
		title: _("breadcrumbs.submission_review"),
		routeName: "SubmissionReviewPage",
	},
];

export const practiceReviewBreadCrumbs: BreadCrumb[] = [
	courseListBreadCrumb,
	courseDashBoardBreadCrumb,
	{
		title: _("breadcrumbs.practice_review"),
		routeName: "PracticeSummaryPage",
	},
];

export const examAssessmentBreadCrumbs: BreadCrumb[] = [
	courseListBreadCrumb,
	courseDashBoardBreadCrumb,
	{
		title: _("breadcrumbs.exam_assessment"),
		routeName: "AssessmentReviewPage",
	},
];

export const exerciseThreadsBreadCrumbs: BreadCrumb[] = [
	courseListBreadCrumb,
	courseDashBoardBreadCrumb,
	{
		title: _("breadcrumbs.exercise_solution_threads"),
		routeName: "CourseDashBoardExerciseThreadList",
	},
];

export const leaderboardBreadCrumbs: BreadCrumb[] = [
	courseListBreadCrumb,
	courseDashBoardBreadCrumb,
	{
		title: _("breadcrumbs.student_course_leaderboard"),
		routeName: "StudentCourseLeaderboard",
	},
];

export const studentFavoritesBreadCrumbs: BreadCrumb[] = [
	courseListBreadCrumb,
	courseDashBoardBreadCrumb,
	{
		title: _("breadcrumbs.student_favorites"),
		routeName: "StudentFavorites",
	},
];

export const exerciseSolutionThreadBreadCrumbs: BreadCrumb[] = [
	...exerciseThreadsBreadCrumbs,
	{
		title: _("breadcrumbs.exercise_solution_thread"),
		routeName: "ExerciseSolutionThread",
	},
];
