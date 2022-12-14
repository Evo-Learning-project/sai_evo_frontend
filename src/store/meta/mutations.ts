// /* eslint-disable @typescript-eslint/no-explicit-any */
// /* eslint-disable @typescript-eslint/explicit-module-boundary-types */
// import { ErrorMessage } from "@/interfaces";
// import { Course, ExerciseSolution, Tag, User } from "@/models";
// import axios from "axios";
// import { MetaStoreState } from "../types";

// export const mutations = {
// 	initStore: (state: MetaStoreState) => {
// 		// TODO refactor
// 		const token = localStorage.getItem("token");
// 		const refreshToken = localStorage.getItem("refreshToken");
// 		const user = localStorage.getItem("user");

// 		if (token) {
// 			console.log("restoring token");
// 			state.token = token;
// 			axios.defaults.headers.common["Authorization"] = "Bearer " + state.token;
// 		}
// 		if (refreshToken) {
// 			state.refreshToken = refreshToken;
// 		}
// 		if (user) {
// 			state.user = JSON.parse(user);
// 		}
// 	},
// 	// setTags: (state: MetaStoreState, tags: Tag[]) => (state.tags = tags),
// 	// setLoading: (state: MetaStoreState, val: boolean) => (state.loading = val),
// 	showSuccessFeedback: (state: MetaStoreState) => {
// 		state.showSuccessFeedback = true;
// 		setTimeout(() => (state.showSuccessFeedback = false), 2000);
// 	},
// 	//set personal user account
// 	setUser: (state: MetaStoreState, { user }: { user: User }) => {
// 		Object.assign(state.user, user);
// 		// TODO use plugin
// 		localStorage.setItem("user", JSON.stringify(user));
// 	},
// 	setToken: (state: MetaStoreState, token: string) => {
// 		state.token = token;
// 		localStorage.setItem("token", token);
// 		axios.defaults.headers.common["Authorization"] = "Bearer " + token;
// 	},
// 	// todo merge into above mutation
// 	resetToken: (state: MetaStoreState) => {
// 		state.token = "";
// 		localStorage.removeItem("token");
// 		axios.defaults.headers.common["Authorization"] = "";
// 	},
// 	setRefreshToken: (state: MetaStoreState, token: string) => {
// 		state.refreshToken = token;
// 		localStorage.setItem("refreshToken", token);
// 	},
// 	// TODO this doesn't belong here
// 	// setCourse: (state: MetaStoreState, course: Course) => {
// 	// 	const target = state.courses.find((c: Course) => c.id == course.id);
// 	// 	if (target) {
// 	// 		Object.assign(target, course);
// 	// 	}
// 	// },

// 	// setCourses: (state: MetaStoreState, courses: Course[]) => (state.courses = courses),
// 	setHelpCenterVisibility: (state: MetaStoreState, visibility: boolean) => {
// 		state.helpCenterOpen = visibility;
// 		if (!visibility) {
// 			state.helpCenterSelectedArticleId = null;
// 		}
// 	},
// 	setHelpCenterArticleId: (state: MetaStoreState, articleId: string | null) =>
// 		(state.helpCenterSelectedArticleId = articleId),
// 	setErrorNotificationData: (
// 		state: MetaStoreState,
// 		{ data, hideTimeout = 4000 }: { data: ErrorMessage | null; hideTimeout: number },
// 	) => {
// 		state.errorNotificationData = data;
// 		if (data) {
// 			setTimeout(() => (state.errorNotificationData = null), hideTimeout);
// 		}
// 	},
// 	// TODO this doesn't belong here
// 	// setExerciseSolution: (
// 	// 	state: MetaStoreState,
// 	// 	{ exerciseId, payload }: { exerciseId: string; payload: ExerciseSolution },
// 	// ) => {
// 	// 	const solutions = state.paginatedSolutionsByExerciseId[exerciseId]?.data;
// 	// 	if (!solutions) {
// 	// 		throw new Error(
// 	// 			"setExerciseSolution: exercise with id " +
// 	// 				exerciseId +
// 	// 				" doesn't have a solutions data object",
// 	// 		);
// 	// 	}
// 	// 	const target = solutions.find(s => s.id == payload.id);
// 	// 	if (target) {
// 	// 		Object.assign(target, payload);
// 	// 	} else {
// 	// 		solutions.push(payload);
// 	// 	}
// 	// },
// };
