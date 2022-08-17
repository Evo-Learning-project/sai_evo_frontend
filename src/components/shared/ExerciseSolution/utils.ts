import { RouteLocationRaw, RouteRecordNormalized } from "vue-router";

export const getExerciseSolutionThreadRoute = (
	courseId: string,
	exerciseId: string,
	solutionId: string,
): RouteLocationRaw => ({
	name: "ExerciseSolutionThreadDispatcher",
	params: { courseId, exerciseId, solutionId },
});

export const getExerciseThreadRoute = (
	courseId: string,
	exerciseId: string,
): RouteLocationRaw => ({
	name: "ExerciseSolutionThread",
	params: { courseId, exerciseId },
});
