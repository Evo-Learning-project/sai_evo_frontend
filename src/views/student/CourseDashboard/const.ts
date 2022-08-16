import { getTranslatedString as _ } from "@/i18n";
import { SidebarOption } from "@/navigation/sidebar";

export const studentDashboardSidebarOptions: SidebarOption[] = [
	{
		label: _("student_dashboard_options.my_exams"),
		requiredPrivileges: [],
		children: [],
		icon: "assignment",
		routeName: "CourseDashBoardExamList",
	},
	{
		label: _("student_dashboard_options.my_practice_sessions"),
		requiredPrivileges: [],
		children: [],
		icon: "fitness_center",
		routeName: "CourseDashBoardPracticeSessionList",
	},
	{
		label: _("student_dashboard_options.popular_exercises"),
		requiredPrivileges: [],
		children: [],
		icon: "topic",
		routeName: "",
	},
	{
		label: _("student_dashboard_options.leaderboard"),
		requiredPrivileges: [],
		children: [],
		icon: "leaderboard",
		routeName: "",
	},
	{
		label: _("student_dashboard_options.my_favorites"),
		requiredPrivileges: [],
		children: [],
		icon: "bookmark",
		routeName: "",
	},
];
