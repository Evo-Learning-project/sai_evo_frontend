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
	if (privileges.length > 0) {
		next({ name: "TeacherDetailExerciseSolutionThreads", params });
	} else {
		next({ name: "ExerciseSolutionThread", params });
	}
};
