import { getTranslatedString as _ } from "@/i18n";
import { CoursePrivilege } from "@/models";

export interface SidebarOption {
	label: string;
	routeName?: string; // ? use better typing
	routeParams?: Record<string, PropertyKey>;
	children?: string[];
	icon?: string;
	requiredPrivileges: CoursePrivilege[];
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
	// {
	//   label: _('sidebar_labels.course_dashboard_practices'),
	//   icon: 'fitness_center',
	//   routeName: '',
	// },
	{
		label: _("sidebar_labels.course_dashboard_exercises"),
		icon: "topic", //'list_alt',
		routeName: "CourseExercises",
		requiredPrivileges: [CoursePrivilege.ACCESS_EXERCISES],
	},
	{
		label: _("sidebar_labels.exercise_solution_threads"),
		icon: "forum",
		routeName: "TeacherCourseExerciseSolutionThreads",
		children: ["TeacherDetailExerciseSolutionThreads"],
		requiredPrivileges: [
			CoursePrivilege.ACCESS_EXERCISES,
			CoursePrivilege.MANAGE_EXERCISES,
		],
	},
	{
		label: _("sidebar_labels.course_permissions"),
		icon: "admin_panel_settings",
		routeName: "CoursePermissions",
		requiredPrivileges: [CoursePrivilege.UPDATE_COURSE],
	},
	{
		label: _("sidebar_labels.course_insights"),
		icon: "insights",
		routeName: "CourseInsights",
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
	},
	{
		label: _("student_dashboard_options.my_exams"),
		requiredPrivileges: [],
		children: [],
		icon: "assignment",
		routeName: "CourseDashBoardExamList",
	},
	{
		label: _("student_dashboard_options.popular_exercises"),
		requiredPrivileges: [],
		children: ["ExerciseSolutionThread"],
		icon: "topic",
		routeName: "CourseDashBoardExerciseThreadList",
	},
	{
		label: _("student_dashboard_options.leaderboard"),
		requiredPrivileges: [],
		children: [],
		icon: "leaderboard",
		routeName: "StudentCourseLeaderboard",
	},
	{
		label: _("student_dashboard_options.my_favorites"),
		requiredPrivileges: [],
		children: [],
		icon: "bookmark",
		routeName: "StudentFavorites",
	},
	{
		label: _("sidebar_labels.course_dashboard_back_to_courses"),
		icon: "chevron_left",
		routeName: "StudentCourseList",
		routeParams: { courseId: "-1" }, // !
		requiredPrivileges: [],
	},
];
