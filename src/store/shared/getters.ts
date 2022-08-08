/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/no-explicit-any */

import { Course, getBlankCourse, getBlankTag, User } from "@/models";
import { SharedState } from "../types";

export const getters = {
	email: (state: SharedState): string => state.user.email,
	isAuthenticated: (state: SharedState) => !!state.token,
	course:
		(state: SharedState) =>
		(courseId: string): Course =>
			state.courses.find((c: Course) => c.id == courseId) ?? getBlankCourse(),
	unsavedChanges: (state: SharedState): boolean => state.saving || state.savingError,
	tagById: (state: SharedState) => (tagId: string) => state.tags.find(t => t.id == tagId) ?? getBlankTag(),
	tagByName: (state: SharedState) => (tagName: string) => state.tags.find(t => t.name == tagName) ?? getBlankTag(),
};
