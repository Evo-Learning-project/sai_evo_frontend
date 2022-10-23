/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { mapState } from "vuex";
import { getTranslatedString as _ } from "./i18n";
import { Course, CoursePrivilege, getBlankCourse } from "./models";
import router from "./router";
import store from "./store/index";
import { SharedState, StudentState } from "./store/types";
import { setErrorNotification, setPageWideError } from "./utils";
export const courseIdMixin = {
	computed: {
		courseId(): string {
			return router.currentRoute.value.params.courseId as string;
		},
		currentCourse(): Course {
			return store.getters["shared/course"](this.courseId) ?? getBlankCourse();
		},
	},
};

export const eventIdMixin = {
	computed: {
		eventId(): string {
			return router.currentRoute.value.params.examId as string;
		},
		currentEvent(): string {
			return (
				(store.state as { student: StudentState }).student.currentEventParticipation
					?.event?.name ?? ""
			);
		},
		previewingEvent(): string {
			return (
				(store.state as { student: StudentState }).student.previewingEvent?.name ?? ""
			);
		},
	},
};

export const texMixin = {
	methods: {
		triggerTexRender() {
			const sharedState = (store.state as { shared: SharedState }).shared;
			sharedState.dirtyTex = true;
		},
	},
};

export const mediaQueryMixin = {
	computed: {
		mediaQueryMdMatches(): boolean {
			const mq = window.matchMedia("(min-width: 768px)");
			return mq.matches;
		},
	},
};

export const adComponentMixin = {
	data() {
		return {
			ads1Code: "",
			ads2Code: "",
			ads3Code: "",
			adsMobileCode: "",
		};
	},
	// mounted() {
	// 	const includeAds = JSON.parse(process.env.VUE_APP_ENABLE_ADS ?? "true");
	// 	if (!includeAds) {
	// 		return;
	// 	}
	// 	// ugly trick to get rid of type errors
	// 	const self = this as any;
	// 	self.ads1Code = document.getElementById("ads-div-hidden-1")?.innerHTML ?? "";
	// 	self.ads2Code = document.getElementById("ads-div-hidden-2")?.innerHTML ?? "";
	// 	self.ads3Code = document.getElementById("ads-div-hidden-3")?.innerHTML ?? "";
	// 	self.adsMobileCode =
	// 		document.getElementById("ads-div-hidden-mobile")?.innerHTML ?? "";
	// },
};

export const loadingMixin = {
	methods: {
		async withLoading(
			callback: () => unknown,
			onError?: (e?: unknown) => unknown,
			onSuccess?: () => void,
		) {
			const sharedState = (store.state as { shared: SharedState }).shared;

			sharedState.loading = true;
			try {
				const ret = await callback();
				sharedState.dirtyTex = true; // trigger tex rendering
				onSuccess?.();
				return ret;
			} catch (e) {
				onError?.(e);
			} finally {
				sharedState.loading = false;
			}
		},
		async withFirstLoading(callback: () => unknown, onError = setPageWideError) {
			const sharedState = (store.state as { shared: SharedState }).shared;

			sharedState.firstLoading = true;
			try {
				const ret = await callback();
				sharedState.dirtyTex = true; // trigger tex rendering
				return ret;
			} catch (e: any) {
				onError?.(e);
			} finally {
				sharedState.firstLoading = false;
			}
		},
		async withLocalLoading(callback: () => unknown, onError = setErrorNotification) {
			const sharedState = (store.state as { shared: SharedState }).shared;

			sharedState.localLoading = true;
			try {
				const ret = await callback();
				sharedState.dirtyTex = true; // trigger tex rendering
				return ret;
			} catch (e: any) {
				onError?.(e);
			} finally {
				sharedState.localLoading = false;
			}
		},
		setPageWideError,
		setErrorNotification,
	},
	computed: {
		...mapState("shared", ["firstLoading", "localLoading", "loading"]),
	},
};

export const savingMixin = {
	watch: {
		saving(newVal: boolean) {
			(store.state as any).shared.saving = newVal;
		},
		savingError(newVal: boolean) {
			(store.state as any).savingError = newVal;
		},
	},
};

export const coursePrivilegeMixin = {
	methods: {
		hasPrivileges(requiredPrivilegesList: CoursePrivilege[]) {
			/**
			 * Given a list of required privileges, returns true iff the current
			 * user has such privileges for the current course
			 */
			const myPrivileges: CoursePrivilege[] =
				(store.state as any).shared.courses.find(
					(c: Course) => c.id == (router.currentRoute.value.params.courseId as string),
				)?.privileges ?? [];

			return requiredPrivilegesList.every(p => myPrivileges.includes(p));
		},
		hasAnyPrivileges() {
			const myPrivileges: CoursePrivilege[] =
				(store.state as any).shared.courses.find(
					(c: Course) => c.id == (router.currentRoute.value.params.courseId as string),
				)?.privileges ?? [];

			return myPrivileges.length > 0;
		},
	},
};
