<template>
	<!-- <div> -->
	<div
		v-if="metaStore.loading"
		style="z-index: 999"
		class="fixed transform -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2"
	>
		<Spinner :size="'xl'" :variant="'dark'" :fast="true"></Spinner>
	</div>
	<transition name="fade">
		<Notification v-if="metaStore._showSuccessFeedback"></Notification>
	</transition>
	<transition name="fade">
		<!-- unfortunately doesn't work -->
		<Notification
			:icon="'cloud_off'"
			:text="$t('misc.confirm_exiting_unsaved_changes')"
			v-if="showUnsavedChangesNotification"
		></Notification>
	</transition>
	<router-view class="" />
	<footer
		class="flex items-center w-full h-12 px-6 py-3 mt-auto text-sm text-white bg-dark"
	>
		<p>
			Crafted with ❤️ by
			<a
				target="_blank"
				class="font-semibold text-indigo-400 hover:underline"
				href="http://bsamu.it"
				>Samuele Bonini</a
			>
		</p>
		<Tooltip
			v-if="!isDemoMode"
			:placement="'left'"
			class="ml-auto"
			:textCode="'telegram'"
		>
			<a href="https://t.me/sai_evo" target="_blank"
				><img
					class="w-5 h-5 transition-opacity duration-75 opacity-70 hover:opacity-100"
					src="../public/telegram.jpg"
			/></a>
		</Tooltip>
	</footer>
	<!-- </div> -->
</template>
<script lang="ts">
import { defineComponent } from "@vue/runtime-core";
import Spinner from "./components/ui/Spinner.vue";
import Notification from "./components/ui/Notification.vue";
import { getTranslatedString as _ } from "./i18n";

import { debounce } from "lodash";
import { Course, CoursePrivilege } from "./models";
import Tooltip from "./components/ui/Tooltip.vue";

//import { typesetTex } from "./utils";

export default defineComponent({
	setup() {
		// TODO temporary workaround for a werid issue: if use import like this:
		//import { useMainStore } from "./stores/mainStore";
		// the app won't render as useMainStore will be undefined in other components; investigate
		const useMainStore = require("./stores/mainStore").useMainStore;
		const useMetaStore = require("./stores/metaStore").useMetaStore;
		const mainStore = useMainStore();
		const metaStore = useMetaStore();
		return {
			mainStore,
			metaStore,
		};
	},
	beforeCreate(): void {
		//this.$store.commit("shared/initStore");
		this.metaStore.initStore();
	},
	beforeUnmount() {
		window.removeEventListener("beforeunload", this.beforeWindowUnload);
	},
	components: {
		Spinner,
		Notification,
		Tooltip,
	},
	async created() {
		if (this.metaStore.isAuthenticated) {
			try {
				await this.mainStore.getCourses();
				if (!this.hasAnyPrivileges && this.isTeacherRoute) {
					this.$router.push(
						this.metaStore.user?.is_teacher ? "/teacher/courses" : "/student/courses",
					);
				}
			} catch (e) {
				console.log("Caught", e);
			}
		}
		window.addEventListener("beforeunload", this.beforeWindowUnload);

		this.typesetTex = debounce(this.typesetTex, 100);
	},
	watch: {
		dirtyTex(newVal) {
			console.log("changed");
			if (newVal) {
				this.typesetTex();
				this.metaStore.dirtyTex = false;
			}
		},
	},
	data() {
		return {
			showUnsavedChangesNotification: false,
		};
	},
	methods: {
		typesetTex() {
			(window as any).MathJax?.typeset?.();
		},
		beforeWindowUnload(e: { preventDefault: () => void; returnValue: string }) {
			if (
				this.metaStore.unsavedChanges &&
				!window.confirm(_("misc.confirm_exiting_unsaved_changes"))
			) {
				// Cancel the event
				e.preventDefault();
				// Chrome requires returnValue to be set
				e.returnValue = "";
			}
		},
	},
	computed: {
		dirtyTex() {
			return this.metaStore.dirtyTex;
		},
		isDemoMode() {
			return JSON.parse(process.env.VUE_APP_DEMO_MODE ?? "false");
		},
		hasAnyPrivileges(): boolean {
			if (this.$router.currentRoute.value.params.courseId) {
				// check user has privileges for course currrently visited
				const myPrivileges: CoursePrivilege[] =
					this.mainStore.courses.find(
						(c: Course) =>
							c.id == (this.$router.currentRoute.value.params.courseId ?? ""),
					)?.privileges ?? [];
				return myPrivileges.length > 0;
			}

			// check user has any privileges at all if not visiting a
			// course (i.e. in course list) or that the user is a teacher
			return (
				this.metaStore.user?.is_teacher ||
				(this.mainStore.courses as Course[])
					.map(c => c.privileges ?? [])
					.some(p => p.length > 0)
			);
		},
		isTeacherRoute(): boolean {
			return !!this.$route.meta.teacherRoute;
		},
	},
});
</script>
