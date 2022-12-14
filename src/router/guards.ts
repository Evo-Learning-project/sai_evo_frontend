import { getCourse } from "@/api/courses";
import {
	NavigationGuardNext,
	RouteLocationNormalized,
	RouteLocationRaw,
} from "vue-router";

// TODO refactor guards to factor out shared logic

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

export const courseTreeNodeDetailBeforeGuard = async (
	to: RouteLocationNormalized,
	_: RouteLocationNormalized,
	next: NavigationGuardNext,
) => {
	const params = to.params;
	const course = await getCourse(params.courseId as string);
	const privileges = course.privileges ?? [];
	if (privileges.length > 0) {
		next({ name: "TeacherNodeDetail", params });
	} else {
		next({ name: "StudentNodeDetail", params });
	}
};

export const courseTreeBeforeGuard = async (
	to: RouteLocationNormalized,
	_: RouteLocationNormalized,
	next: NavigationGuardNext,
) => {
	const params = to.params;
	const course = await getCourse(params.courseId as string);
	const privileges = course.privileges ?? [];
	if (privileges.length > 0) {
		next({ name: "TeacherCourseTree", params });
	} else {
		next({ name: "StudentCourseTree", params });
	}
};
