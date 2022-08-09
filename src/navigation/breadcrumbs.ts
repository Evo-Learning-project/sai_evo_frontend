import { getTranslatedString as _ } from "@/i18n";

export interface BreadCrumb {
	title: string;
	routeName?: string;
	routeParams?: string[];
}

const courseListBreadCrumb: BreadCrumb = {
	title: _("breadcrumbs.course_list"),
	routeName: "StudentCourseList",
};

const courseDashBoardBreadCrumb: BreadCrumb = {
	title: _("breadcrumbs.course_dashboard"),
	routeName: "StudentCourseDashboard",
	routeParams: ["courseId"],
};

export const courseListBreadCrumbs: BreadCrumb[] = [courseListBreadCrumb];

export const courseDashBoardBreadCrumbs: BreadCrumb[] = [
	courseListBreadCrumb,
	courseDashBoardBreadCrumb,
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
