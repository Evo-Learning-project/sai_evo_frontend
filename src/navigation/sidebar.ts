import { getTranslatedString as _ } from "@/i18n";
import { CourseFeature, CoursePrivilege } from "@/models";

export interface SidebarOption {
	label: string;
	routeName?: string; // ? use better typing
	routeParams?: Record<string, PropertyKey>;
	children?: string[];
	icon?: string;
	requiredPrivileges: CoursePrivilege[];
	requiresTeacher?: boolean;
	requiredFeatures?: CourseFeature[];
}

export const courseListSidebarOptions: SidebarOption[] = [
	{
		label: _("sidebar_labels.course_list_courses"),
		icon: "list",
		routeName: "TeacherCourseList",
		requiredPrivileges: [],
	},
	{
		label: _("sidebar_labels.course_list_new_course"),
		icon: "add",
		routeName: "CourseCreationForm",
		requiredPrivileges: [],
	},
];

export const studentCourseListSidebarOptions: SidebarOption[] = [
	{
		label: _("sidebar_labels.course_list_courses"),
		icon: "list",
		routeName: "StudentCourseList",
		requiredPrivileges: [],
	},
];

export const courseDashboardSidebarOptions: SidebarOption[] = [
	{
		label: _("sidebar_labels.course_dashboard_dashboard"),
		icon: "home",
		routeName: "TeacherCourseDashboard",
		requiredPrivileges: [],
	},
	{
		label: _("sidebar_labels.course_dashboard_exams"),
		icon: "assignment", //'quiz',
		routeName: "CourseExams",
		children: [
			"ExamEditor",
			"ExamResults",
			"ExamProgress",
			"ExamStats",
			"ExamParticipationFull",
		],
		requiredPrivileges: [],
	},
	{
		label: _("sidebar_labels.course_dashboard_exercises"),
		icon: "topic",
		routeName: "CourseExercises",
		requiredPrivileges: [CoursePrivilege.ACCESS_EXERCISES],
	},
	{
		label: _("sidebar_labels.course_dashboard_material"),
		icon: "class",
		routeName: "TeacherCourseTree",
		children: ["TeacherNodeDetail"],
		requiredPrivileges: [], //[CoursePrivilege.MANAGE_MATERIAL],
	},
	{
		label: _("sidebar_labels.course_insights"),
		icon: "assignment_ind", //"insights",
		routeName: "CourseInsights",
		requiredPrivileges: [],
	},
	{
		label: _("sidebar_labels.exercise_solution_threads"),
		icon: "forum",
		routeName: "TeacherCourseExerciseSolutionThreads",
		children: ["TeacherDetailExerciseSolutionThreads"],
		requiredPrivileges: [CoursePrivilege.MANAGE_EXERCISE_SOLUTIONS],
	},
	{
		label: _("sidebar_labels.course_permissions"),
		icon: "admin_panel_settings",
		routeName: "CoursePermissions",
		requiredPrivileges: [], //[CoursePrivilege.UPDATE_COURSE],
	},
	{
		label: _("sidebar_labels.course_integrations"),
		icon: "extension",
		routeName: "CourseIntegrations",
		requiredPrivileges: [],
	},
	{
		label: _("sidebar_labels.course_dashboard_back_to_courses"),
		icon: "chevron_left",
		routeName: "TeacherCourseList",
		requiredPrivileges: [],
	},
];

export const studentDashboardSidebarOptions: SidebarOption[] = [
	{
		label: _("student_dashboard_options.my_practice_sessions"),
		requiredPrivileges: [],
		children: [],
		icon: "fitness_center",
		routeName: "CourseDashBoardPracticeSessionList",
		requiredFeatures: [CourseFeature.PRACTICE],
	},
	{
		label: _("sidebar_labels.course_dashboard_material"),
		icon: "class",
		routeName: "StudentCourseTree",
		children: ["StudentNodeDetail"],
		requiredPrivileges: [],
		requiredFeatures: [CourseFeature.MATERIAL],
	},
	{
		label: _("student_dashboard_options.my_exams"),
		requiredPrivileges: [],
		children: [],
		icon: "assignment",
		routeName: "CourseDashBoardExamList",
		requiredFeatures: [CourseFeature.MY_EXAMS],
	},
	// TODO add public exams
	{
		label: _("student_dashboard_options.popular_exercises"),
		requiredPrivileges: [],
		children: ["ExerciseSolutionThread"],
		icon: "topic",
		routeName: "CourseDashBoardExerciseThreadList",
		requiredFeatures: [CourseFeature.EXERCISE_SOLUTIONS],
	},
	{
		label: _("student_dashboard_options.leaderboard"),
		requiredPrivileges: [],
		children: [],
		icon: "leaderboard",
		routeName: "StudentCourseLeaderboard",
		requiredFeatures: [CourseFeature.LEADERBOARD],
	},
	{
		label: _("student_dashboard_options.my_favorites"),
		requiredPrivileges: [],
		children: [],
		icon: "bookmark_outline",
		routeName: "StudentFavorites",
		requiredFeatures: [CourseFeature.BOOKMARKED],
	},
	{
		label: _("sidebar_labels.course_dashboard_back_to_courses"),
		icon: "chevron_left",
		routeName: "StudentCourseList",
		routeParams: { courseId: "-1" }, // !
		requiredPrivileges: [],
	},
];
