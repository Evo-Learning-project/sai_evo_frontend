/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { mapStores } from "pinia";
import { mapState } from "vuex";
import { getTranslatedString as _ } from "./i18n";
import { DialogData } from "./interfaces";
import { Course, CoursePrivilege, getBlankCourse } from "./models";
import router from "./router";
import store from "./store/index";
import { SharedState, StudentState } from "./store/types";
import { useMainStore } from "./stores/mainStore";
import { useMetaStore } from "./stores/metaStore";
import { setErrorNotification, setPageWideError } from "./utils";
export const courseIdMixin = {
	computed: {
		courseId(): string {
			return router.currentRoute.value.params.courseId as string;
		},
		currentCourse(): Course {
			const mainStore = useMainStore();
			return mainStore.getCourseById(this.courseId as any as string) ?? getBlankCourse();
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
			const metaStore = useMetaStore();
			metaStore.dirtyTex = true;
		},
	},
};

export const blockingDialogMixin = {
	data() {
		return {
			blockingDialogData: null as null | DialogData,
			showBlockingDialog: false,
			blockingDialogPromise: null as null | Promise<boolean>,
			resolveBlockingDialog: null as null | ((boolean) => void),
		};
	},
	methods: {
		async getBlockingBinaryDialogChoice(): Promise<boolean> {
			const self = this as any; // temporary workaround to prevent type errors

			self.showBlockingDialog = true;

			self.blockingDialogPromise = new Promise(
				resolve => (self.resolveBlockingDialog = resolve),
			);
			const choice = await self.blockingDialogPromise;

			//self.showBlockingDialog = false;
			return choice;
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
			const sharedState = useMetaStore();

			(this as any).metaStore.loading = true;
			try {
				const ret = await callback();
				(this as any).metaStore.dirtyTex = true; // trigger tex rendering
				onSuccess?.();
				return ret;
			} catch (e) {
				onError?.(e);
			} finally {
				(this as any).metaStore.loading = false;
			}
		},
		async withFirstLoading(callback: () => unknown, onError = setPageWideError) {
			(this as any).metaStore.firstLoading = true;

			try {
				const ret = await callback();
				(this as any).metaStore.dirtyTex = true; // trigger tex rendering
				return ret;
			} catch (e: any) {
				onError?.(e);
			} finally {
				(this as any).metaStore.firstLoading = false;
			}
		},
		async withLocalLoading(callback: () => unknown, onError = setErrorNotification) {
			(this as any).metaStore.localLoading = true;
			try {
				const ret = await callback();
				(this as any).metaStore.dirtyTex = true; // trigger tex rendering
				return ret;
			} catch (e: any) {
				onError?.(e);
			} finally {
				(this as any).metaStore.localLoading = false;
			}
		},
		setPageWideError,
		setErrorNotification,
	},
	computed: {
		...mapStores(useMetaStore),
		loading() {
			return (this.metaStore as any).loading;
		},
		localLoading() {
			return (this.metaStore as any).localLoading;
		},
		firstLoading() {
			return (this.metaStore as any).firstLoading;
		},
	},
};

export const savingMixin = {
	watch: {
		saving(newVal: boolean) {
			/* TODO this will give problems with multiple saving components
			at the same time: use a counter instead; increment it when newVal
			is true, decrement it when it's false
			*/
			useMetaStore().saving = newVal;
		},
		savingError(newVal: boolean) {
			useMetaStore().savingError = newVal;
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
			const myPrivileges = (this as any).userCoursePrivileges;
			console.log(myPrivileges);
			return requiredPrivilegesList.every(p => myPrivileges.includes(p));
		},
		hasAnyPrivileges() {
			const myPrivileges = (this as any).userCoursePrivileges;
			return myPrivileges.length > 0;
		},
	},
	computed: {
		userCoursePrivileges() {
			return (
				useMainStore().getCourseById(router.currentRoute.value.params.courseId as string)
					?.privileges ?? []
			);
		},
	},
};
