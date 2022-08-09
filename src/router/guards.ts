import { getCourse } from "@/api/courses";
import {
	NavigationGuardNext,
	RouteLocationNormalized,
	RouteLocationRaw,
} from "vue-router";

export const exerciseSolutionThreadBeforeGuard = async (
	to: RouteLocationNormalized,
	_: RouteLocationNormalized,
	next: NavigationGuardNext,
) => {
	const params = to.params;
	const course = await getCourse(params.courseId as string);
	const privileges = course.privileges ?? [];
	console.log("REDIRECTING", to, _);
	next({ name: "ExerciseSolutionThread", params });
	// if (privileges.length > 0) {
	// 	next("TeacherSolutions");
	// } else {
	// 	next("StudentSolutions");
	// }
};
