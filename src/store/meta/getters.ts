import {
	Course,
	getBlankCourse,
	getBlankTag,
	User,
	Exercise,
	ExerciseSolution,
} from "@/models";
import { MetaStoreState } from "../types";

export const getters = {
	email: (state: MetaStoreState): string => state.user.email,
	isAuthenticated: (state: MetaStoreState) => !!state.token,
	// TODO move to main store
	// course:
	// 	(state: MetaStoreState) =>
	// 	(courseId: string): Course =>
	// 		state.courses.find((c: Course) => c.id == courseId) ?? getBlankCourse(),
	unsavedChanges: (state: MetaStoreState): boolean => state.saving || state.savingError,
	// TODO move to main store
	// tagById: (state: MetaStoreState) => (tagId: string) =>
	// 	state.tags.find(t => t.id == tagId) ?? getBlankTag(),
	// tagByName: (state: MetaStoreState) => (tagName: string) =>
	// 	state.tags.find(t => t.name == tagName) ?? getBlankTag(),
	// exerciseSolutions: (
	// 	state: MetaStoreState,
	// 	_getters: any,
	// 	_rootState: any,
	// 	rootGetters: any,
	// ): ExerciseSolution[] => [
	// 	// TODO handle duplicates ...(rootGetters["student/exercises"] as Exercise[]).flatMap(e => e.solutions ?? []),
	// 	...Object.values(state.paginatedSolutionsByExerciseId).flatMap(p => p.data),
	// ],
};
