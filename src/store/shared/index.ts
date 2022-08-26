/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { PaginatedData } from "@/api/interfaces";
import { ErrorMessage } from "@/interfaces";
import { Course, Exercise, Tag, User } from "@/models";
import { SharedState } from "../types";
import { actions } from "./actions";
import { getters } from "./getters";
import { mutations } from "./mutations";

// import VuexPersistence from 'vuex-persist';

// const vuexLocal = new VuexPersistence({
//   storage: window.localStorage,
//   modules: ['shared'],
//   reducer: (state: any) => ({
//     user: state.user,
//     token: state.token,
//     refreshToken: state.refreshToken,
//   }),
// });

export const sharedStore = {
	namespaced: true,
	//plugins: [vuexLocal.plugin],
	state: (): SharedState => ({
		user: {} as User,
		courses: [] as Course[],
		token: "",
		refreshToken: "",
		loading: false,
		firstLoading: false,
		localLoading: false,
		pageWideErrorData: null as ErrorMessage | null,
		errorNotificationData: null as ErrorMessage | null,
		saving: false,
		savingError: false,
		showSuccessFeedback: false,
		tags: [] as Tag[],
		dirtyTex: false,
		helpCenterOpen: false,
		helpCenterSelectedArticleId: null,
		paginatedSolutionsByExerciseId: {},
		gamificationContext: null,
	}),
	mutations: {
		...mutations,
	},
	actions: {
		...actions,
	},
	getters: {
		...getters,
	},
};
