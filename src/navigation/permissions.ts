import { CoursePrivilege, User } from "@/models";
import { useMainStore } from "@/stores/mainStore";

type RoutePermissionCheckFunction = (user: User, courseId: string) => boolean;

/**
 *
 * TODO idea: use these functions inside of routes' meta, and also in sidebar options
 *
 * have a router guard that before each route runs every function in the meta, and
 * if any returns false, redirects to CourseList
 *
 * for the sidebar, have a computed that runs all checks and filters out options
 */

export const isUserTeacher: RoutePermissionCheckFunction = (user, _) => user.is_teacher;
export const hasCoursePrivileges = (privileges: CoursePrivilege[]) =>
	((user, courseId) => {
		const mainStore = useMainStore();
		const course = mainStore.getCourseById(courseId);
		if (!course) {
			return false;
		}
		return privileges.every(p => (course.privileges ?? []).includes(p));
	}) as RoutePermissionCheckFunction;
