// /* eslint-disable @typescript-eslint/explicit-module-boundary-types */
// import { PaginatedData } from "@/api/interfaces";
// import { ErrorMessage } from "@/interfaces";
// import { Course, Exercise, Tag, User } from "@/models";
// import { SharedState } from "../types";
// import { actions } from "./actions";
// import { getters } from "./getters";
// import { mutations } from "./mutations";

// // import VuexPersistence from 'vuex-persist';

// // const vuexLocal = new VuexPersistence({
// //   storage: window.localStorage,
// //   modules: ['shared'],
// //   reducer: (state: any) => ({
// //     user: state.user,
// //     token: state.token,
// //     refreshToken: state.refreshToken,
// //   }),
// // });

// export const sharedStore = {
// 	namespaced: true,
// 	//plugins: [vuexLocal.plugin],
// 	state: (): SharedState => ({
// 		// user data
// 		user: {} as User,
// 		token: "",
// 		refreshToken: "",

// 		// global data
// 		courses: [] as Course[],
// 		tags: [] as Tag[],
// 		paginatedSolutionsByExerciseId: {},
// 		exerciseTestCaseAttachmentsByTestCaseId: {},

// 		// bookkeeping
// 		loading: false,
// 		firstLoading: false,
// 		localLoading: false,
// 		pageWideErrorData: null as ErrorMessage | null,
// 		errorNotificationData: null as ErrorMessage | null,
// 		saving: false,
// 		savingError: false,
// 		showSuccessFeedback: false,
// 		dirtyTex: false,
// 		helpCenterOpen: false,
// 		helpCenterSelectedArticleId: null,

// 		// gamification
// 		gamificationContext: null,
// 		gamificationContextGoals: [],
// 		progressByGoalId: {},
// 	}),
// 	mutations: {
// 		...mutations,
// 	},
// 	actions: {
// 		...actions,
// 	},
// 	getters: {
// 		...getters,
// 	},
// };
