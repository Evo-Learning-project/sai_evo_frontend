import { RouteLocationRaw, RouteRecordNormalized } from "vue-router";

export const getExerciseSolutionThreadRoute = (
	courseId: string,
	exerciseId: string,
	solutionId: string,
): RouteLocationRaw => ({
	name: "ExerciseSolutionThreadDispatcher",
	params: { courseId, exerciseId, solutionId },
});
