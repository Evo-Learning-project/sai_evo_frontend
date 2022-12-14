import { RouteLocationRaw, RouteRecordNormalized } from "vue-router";

export const getExerciseSolutionThreadRoute = (
	courseId: string,
	exerciseId: string,
	solutionId: string,
): RouteLocationRaw => ({
	name: "ExerciseSolutionThreadDispatcher",
	params: { courseId, exerciseId, solutionId },
});

export const getCourseTreeRoute = (courseId: string): RouteLocationRaw => ({
	name: "CourseTreeDispatcher",
	params: { courseId },
});

export const getCourseTreeNodeRoute = (
	courseId: string,
	nodeId: string,
): RouteLocationRaw => ({
	name: "CourseTreeNodeDetailDispatcher",
	params: { courseId, nodeId },
});

export const getExerciseThreadRoute = (
	courseId: string,
	exerciseId: string,
): RouteLocationRaw => ({
	name: "ExerciseSolutionThread",
	params: { courseId, exerciseId },
});
