import { getMe } from "@/api";
import { getCourse } from "@/api/courses";
import { NavigationGuardNext, RouteLocationNormalized } from "vue-router";

async function hasPrivilegesOverRouteCourse(route: RouteLocationNormalized) {
	const params = route.params;
	const course = await getCourse(params.courseId as string);
	const privileges = course.privileges ?? [];
	return privileges.length > 0;
}

async function isTeacher() {
	const user = await getMe();
	return user.is_teacher;
}

/**
 * A function that takes the name of a privileged route and the name of an unprivileged
 * route and returns a function that can be used as a "before" route guard, which checks
 * if the user has any permissions over the course in the route and conditionally redirects
 * to either the privileged or the unprivileged route based on that
 */
const privilegedRouteWithRedirectBeforeGuard =
	(privilegedRouteName: string, unprivilegedRouteName: string) =>
	async (
		to: RouteLocationNormalized,
		_: RouteLocationNormalized,
		next: NavigationGuardNext,
	) => {
		const params = to.params;
		if (await hasPrivilegesOverRouteCourse(to)) {
			next({ name: privilegedRouteName, params });
		} else {
			next({ name: unprivilegedRouteName, params });
		}
	};

/**
 * Same as above but checks that the user is a teacher instead of checking
 * course-specific permissions
 */
const teacherRouteWithRedirectBeforeGuard =
	(privilegedRouteName: string, unprivilegedRouteName: string) =>
	async (
		to: RouteLocationNormalized,
		_: RouteLocationNormalized,
		next: NavigationGuardNext,
	) => {
		const params = to.params;
		if (await isTeacher()) {
			next({ name: privilegedRouteName, params });
		} else {
			next({ name: unprivilegedRouteName, params });
		}
	};

export const courseListBeforeGuard = teacherRouteWithRedirectBeforeGuard(
	"TeacherCourseList",
	"StudentCourseList",
);

export const exerciseSolutionThreadBeforeGuard = privilegedRouteWithRedirectBeforeGuard(
	"TeacherDetailExerciseSolutionThreads",
	"ExerciseSolutionThread",
);

export const courseTreeNodeDetailBeforeGuard = privilegedRouteWithRedirectBeforeGuard(
	"TeacherNodeDetail",
	"StudentNodeDetail",
);

export const courseTreeBeforeGuard = privilegedRouteWithRedirectBeforeGuard(
	"TeacherCourseTree",
	"StudentCourseTree",
);

export const courseBeforeGuard = privilegedRouteWithRedirectBeforeGuard(
	"TeacherCourseDashboard",
	"StudentCourseDashboard",
);
