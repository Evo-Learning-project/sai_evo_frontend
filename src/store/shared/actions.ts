/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */

import {
	getCourse,
	getCourseGamificationContext,
	getCourses,
	getTags,
} from "@/api/courses";
import {
	updateExerciseChoice,
	updateExerciseTestCase,
	updateExerciseSubExercise,
	getExerciseChoices,
	updateExerciseSolution,
	createExerciseSolution,
	getExerciseSolutionsByExercise,
	getExerciseTestCaseAttachments,
	createExerciseTestCaseAttachment,
} from "@/api/exercises";
import { ExerciseSolutionSearchFilter } from "@/api/interfaces";
import { getMe, updateUser } from "@/api/users";
import { updatePaginatedData } from "@/api/utils";
import { getContextGoals, getGoalProgress } from "@/gamification";
import {
	Exercise,
	exerciseChildrenNames,
	ExerciseChoice,
	ExerciseTestCase,
	User,
	ExerciseSolution,
	ExerciseTestCaseAttachment,
} from "@/models";

import axios from "axios";
import { Commit } from "vuex";
import { SharedState } from "../types";

export const actions = {
	// converts a token issued by Google to a token usable to authenticate requests to the backend
	convertToken: ({ commit }: { commit: Commit }, token: string) => {
		return new Promise((resolve, reject) => {
			axios
				.post("/users/auth/convert-token/", {
					token,
					grant_type: "convert_token",
					client_id: process.env.VUE_APP_GOOGLE_OAUTH_CLIENT_ID,
					client_secret: process.env.VUE_APP_GOOGLE_OAUTH_CLIENT_SECRET,
					backend: "google-oauth2",
				})
				.then(response => {
					commit("setToken", response.data.access_token);
					commit("setRefreshToken", response.data.refresh_token);
					resolve(response);
				})
				.catch(error => {
					reject(error);
				});
		});
	},
	getUserData: async ({ commit }: { commit: Commit }) => {
		const response = await getMe();
		commit("setUser", { user: response });
	},
	updateUser: async (
		{ commit }: { commit: Commit },
		{ userId, changes }: { userId: string; changes: Partial<User> },
	) => {
		const response = await updateUser(userId, changes);
		commit("setUser", { user: response });
	},
	getCourse: async (
		{ commit }: { commit: Commit },
		{ courseId }: { courseId: string },
	) => {
		const { participations, ...course } = await getCourse(courseId);
		commit("setCourse", course);
	},
	getCourseGamificationContext: async (
		{ state }: { state: SharedState },
		{ courseId }: { courseId: string },
	) => {
		try {
			const context = await getCourseGamificationContext(courseId);
			state.gamificationContext = context;
		} catch {
			state.gamificationContext = null;
		}
	},
	getGamificationContextGoals: async (
		{ state }: { state: SharedState },
		{ contextId }: { contextId: string },
	) => {
		const goals = await getContextGoals(contextId);
		state.gamificationContextGoals = goals;
		state.progressByGoalId = {};
	},
	getGamificationGoalProgress: async (
		{ state }: { state: SharedState },
		{ contextId, goalId }: { contextId: string; goalId: string },
	) => {
		try {
			const progress = await getGoalProgress(contextId, goalId);
			state.progressByGoalId[goalId] = progress;
		} catch (e) {
			state.progressByGoalId[goalId] = { current_level: 0, action_counts: [] };
		}
	},
	getCourses: async ({ commit }: { commit: Commit }) => {
		const courses = await getCourses();
		commit("setCourses", courses);
	},
	getTags: async (
		{ commit }: { commit: Commit },
		{
			courseId,
			includeExerciseCount = false,
		}: { courseId: string; includeExerciseCount: boolean },
	) => {
		const tags = await getTags(courseId, includeExerciseCount);
		commit("setTags", tags);
	},
	getSolutionsByExercise: async (
		{ state }: { state: SharedState },
		{
			courseId,
			exerciseId,
			fromFirstPage = true,
			filter = null,
		}: {
			courseId: string;
			exerciseId: string;
			fromFirstPage: boolean;
			filter: ExerciseSolutionSearchFilter | null;
		},
	) => {
		const paginatedSolutionsForExercise =
			state.paginatedSolutionsByExerciseId[exerciseId];
		const paginatedSolutions = await getExerciseSolutionsByExercise(
			courseId,
			exerciseId,
			fromFirstPage ? 1 : (paginatedSolutionsForExercise?.pageNumber ?? 0) + 1, // TODO refactor
			filter,
		);

		if (fromFirstPage) {
			state.paginatedSolutionsByExerciseId[exerciseId] = paginatedSolutions;
		} else {
			state.paginatedSolutionsByExerciseId[exerciseId] = updatePaginatedData(
				state.paginatedSolutionsByExerciseId[exerciseId],
				paginatedSolutions,
				false,
			);
		}

		return !state.paginatedSolutionsByExerciseId[exerciseId].isLastPage;
	},
	updateExerciseChild: async (
		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		{ commit }: { commit: Commit },
		{
			courseId,
			exerciseId,
			childType,
			payload,
			reFetch = false,
		}: {
			courseId: string;
			exerciseId: string;
			childType: "testcase" | "sub_exercise" | "choice" | "solution";
			payload: ExerciseChoice | Exercise | ExerciseTestCase;
			reFetch: boolean;
		},
	) => {
		const apiCall = {
			choice: updateExerciseChoice,
			testcase: updateExerciseTestCase,
			sub_exercise: updateExerciseSubExercise,
			solution: updateExerciseSolution,
		}[childType];

		//const childrenName = exerciseChildrenNames[childType];

		await apiCall(courseId, exerciseId, payload.id as string, payload as any);

		if (reFetch) {
			if (childType !== "choice") return;
			const choices = await getExerciseChoices(courseId, exerciseId);
			commit(
				"teacher/setExerciseChildren",
				{
					exerciseId,
					children: "choices",
					payload: choices,
				},
				{ root: true },
			);
		}
	},
	getExerciseTestCaseAttachments: async (
		{ state }: { state: SharedState },
		{
			courseId,
			exerciseId,
			testcaseId,
		}: {
			courseId: string;
			exerciseId: string;
			testcaseId: string;
		},
	) => {
		const attachments = await getExerciseTestCaseAttachments(
			courseId,
			exerciseId,
			testcaseId,
		);

		state.exerciseTestCaseAttachmentsByTestCaseId[testcaseId] = attachments;
		return attachments;
	},
	createExerciseTestCaseAttachment: async (
		{ state }: { state: SharedState },
		{
			courseId,
			exerciseId,
			testcaseId,
			attachment,
		}: {
			courseId: string;
			exerciseId: string;
			testcaseId: string;
			attachment: Blob;
		},
	) => {
		console.log("ACTION", attachment);
		const response = await createExerciseTestCaseAttachment(
			courseId,
			exerciseId,
			testcaseId,
			attachment,
		);
		state.exerciseTestCaseAttachmentsByTestCaseId[testcaseId] ??= [];
		state.exerciseTestCaseAttachmentsByTestCaseId[testcaseId].push(response);
	},
};
