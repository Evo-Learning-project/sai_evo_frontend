<template>
	<div class="h-full flex flex-col">
		<div
			v-if="metaStore.loading"
			style="z-index: 999"
			class="fixed transform -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2"
		>
			<Spinner :size="'xl'" :variant="'dark'" :fast="true" />
		</div>
		<transition name="fade">
			<Notification v-if="metaStore._showSuccessFeedback"></Notification>
		</transition>
		<div class="flex flex-col flex-grow">
			<!-- top app bar -->
			<div class="sticky top-0" style="z-index: 1000">
				<AppBar
					:showCollapseSideBarButton="showSidebar"
					:showMobileSidebarButton="showSidebar"
					@toggleSidebarCollapsed="onToggleCollapseSidebar()"
					@toggleMobileSidebar="onToggleMobileSidebar()"
					:showHelpCenterButton="showHelpCenterButton"
					:showLocaleSelector="showLocaleSelector"
					:sidebarCollapsed="sidebarCollapsed"
					@logout="logOut()"
					:sticky="false"
				/>
				<header
					style="min-height: 1.75rem"
					v-if="showSecondaryHeader"
					class="shadow-elevation mb-4 bg-gray-100 flex items-center"
				>
					<div class="flex w-full px-4 mx-auto md:items-center sm:px-6 lg:px-8">
						<div class="md:items-center md:flex-row">
							<!-- <h2 class="mb-0 text-lg md:mr-6 md:text-2xl">
						{{ routeTitle }}
					</h2> -->
							<BreadCrumbs
								v-if="$route.meta?.breadcrumbs && !$route.meta?.hideBreadcrumbs"
								:route="$route"
								class="mt-1 md:ml-0"
							></BreadCrumbs>
						</div>
						<div class="flex ml-auto md:w-80">
							<div class="ml-auto" id="main-student-header-right"></div>
						</div>
					</div>
				</header>
			</div>

			<!-- main pane containing sidebar & current view-->
			<div class="flex relative flex-grow">
				<SideBar
					@logout="logOut()"
					:header="currentCourseName"
					v-if="showSidebar"
					:sidebarOptions="sidebarOptions"
					@toggleMobileSidebar="onToggleMobileSidebar()"
					:collapsed="sidebarCollapsed"
					:showMobileSidebar="showMobileSidebar"
					:initializing="initializingSidebar"
				>
					<template v-if="!isTeacherRoute" v-slot:header>
						<div class="">
							<!-- <div class="mx-auto flex space-x-2 items-center">
								<Avatar :user="metaStore.user" :size="'lg'" />
								<div class="flex flex-col">
									<p class="text-sm mb-0">{{ metaStore.email }}</p>
									<p class="text-xs text-muted -mt-0.5">
										{{ metaStore.user?.mat }}
									</p>
								</div>
							</div> -->
							<div
								class="relative flex items-center mt-0.5 -ml-0.5"
								v-if="mainStore.gamificationContext"
							>
								<p class="material-icons mr-1.5 text-primary text-base">auto_awesome</p>
								<p class="font-semibold">
									{{ mainStore.gamificationContext?.reputation ?? 0 }}
								</p>
								<div
									class="flex items-center space-x-1"
									v-if="
										mainStore.gamificationContext &&
										mainStore.gamificationContext.leaderboard_position !== null
									"
								>
									<p class="ml-3 material-icons-outlined text-primary text-base">
										leaderboard
									</p>
									<p class="">
										{{ mainStore.gamificationContext.leaderboard_position }}
									</p>
									<p
										v-if="mainStore.gamificationContext.leaderboard_position <= 3"
										:class="{
											'text-yellow-400':
												mainStore.gamificationContext.leaderboard_position === 1,
											'text-gray-400':
												mainStore.gamificationContext.leaderboard_position === 2,
											'text-yellow-900':
												mainStore.gamificationContext.leaderboard_position === 3,
										}"
									>
										<svg style="width: 18px; height: 18px" viewBox="0 0 24 24">
											<path
												fill="currentColor"
												d="M5 16L3 5L8.5 10L12 4L15.5 10L21 5L19 16H5M19 19C19 19.6 18.6 20 18 20H6C5.4 20 5 19.6 5 19V18H19V19Z"
											/>
										</svg>
									</p>
								</div>
								<!-- <Btn
									:tooltip="showGamificationPanel ? '' : $t('gamification.show_panel')"
									:variant="'icon'"
									@click="showGamificationPanel = !showGamificationPanel"
									:outline="true"
									><span
										style="font-size: 20px !important"
										:class="{
											'material-icons-outlined': !showGamificationPanel,
											'material-icons': showGamificationPanel,
										}"
										>visibility</span
									>
								</Btn> -->
								<!-- <DraggablePopup
									:title="''"
									v-if="showGamificationPanel"
									@close="showGamificationPanel = false"
									:initialTop="160"
									:initialLeft="1"
									:opaque="true"
									:resizable="false"
									:fullWidth="true"
								>
									<GamificationContextPanel
										style="margin-top: -34px"
										class="w-full"
										v-if="showGamificationPanel"
									/>
								</DraggablePopup> -->
							</div>
						</div>
					</template>
					<template v-if="hasAnyPrivileges && !isTeacherRoute" v-slot:footer>
						<div
							class="
								mt-4
								-mx-4
								flex flex-col
								space-y-1
								items-center
								vsm--footer
								bg-primary-light bg-opacity-5
								px-3
								py-4
							"
						>
							<p class="mx-auto text-muted text-sm text-center">
								{{ $t("student_course_dashboard.you_are_in_student_mode") }}
							</p>
							<router-link
								class="w-full"
								:to="{
									name: 'TeacherCourseDashboard',
									params: { courseId: currentCourse?.id ?? '-1' },
								}"
								><Btn :outline="true" class="w-full">
									<span class="mr-1 text-lg material-icons-two-tone two-tone-primary">
										shield
									</span>
									<span class="text-base md:text-xs xl:text-base 2xl:text-lg">{{
										$t("courses.course_panel")
									}}</span>
								</Btn></router-link
							>
						</div>
					</template>
				</SideBar>
				<ErrorView
					v-if="metaStore.pageWideErrorData"
					:data="metaStore.pageWideErrorData"
				></ErrorView>

				<router-view
					:style="
						showSidebar
							? sidebarCollapsed && mediaQueryMd
								? 'width: 100%; padding-left: ' +
								  Math.max(routerViewPaddingLeft + 30, 100) +
								  'px; padding-right: 30px'
								: (!sidebarCollapsed && mediaQueryMd
										? 'padding-left: calc(16.66667% + 30px); width: 100%; padding-right: 30px'
										: '') +
								  (!mediaQueryMd
										? 'width: 100%; padding-left: 12px; padding-right: 12px'
										: '')
							: ''
					"
					class="px-2 md:px-6 lg:px-10 py-4"
					v-else
				/>

				<transition name="quick-bounce">
					<SnackBar
						class="w-full px-4 pb-10"
						v-if="metaStore.errorNotificationData"
						:icon="metaStore.errorNotificationData.icon"
						:message="metaStore.errorNotificationData.title"
					/>
				</transition>
			</div>
		</div>
		<footer
			class="flex items-center w-full h-12 px-6 py-3 mt-auto text-sm text-white bg-dark"
		>
			<p class="">
				<!-- <span class="mr-0.5">&copy;</span> -->
				<a
					target="_blank"
					class="font-semibold text-indigo-400 hover:underline"
					href="https://evo-learning.com"
					>Evo Learning</a
				>
			</p>
			<p class="mx-2">&#183;</p>
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
	</div>
</template>
<script lang="ts">
import { defineComponent, Ref, ref } from "@vue/runtime-core";
import Spinner from "./components/ui/Spinner.vue";
import Notification from "./components/ui/Notification.vue";
import { getTranslatedString as _ } from "./i18n";

import { debounce } from "lodash";
import { Course, CoursePrivilege } from "./models";
import Tooltip from "./components/ui/Tooltip.vue";
import SideBar from "./components/ui/SideBar.vue";
import { RouterView } from "vue-router";
import { SidebarOption } from "./navigation/sidebar";
import { metaStore } from "./store/meta";
import { isDemoMode } from "./utils";
import AppBar from "./components/ui/AppBar.vue";
import SnackBar from "./components/ui/SnackBar.vue";
import ErrorView from "./views/shared/ErrorView.vue";
import Btn from "./components/ui/Btn.vue";
import { Breadcrumbs } from "@sentry/browser/dist/integrations";
import BreadCrumbs from "./components/ui/BreadCrumbs.vue";

//import { typesetTex } from "./utils";
const SIDEBAR_COLLASPED_LOCALSTORAGE = "sidebar_collapsed";
export default defineComponent({
	setup() {
		// TODO temporary workaround for a werid issue: if use import like this:
		//import { useMainStore } from "./stores/mainStore";
		// the app won't render as useMainStore will be undefined in other components; investigate
		const useMainStore = require("./stores/mainStore").useMainStore;
		const useMetaStore = require("./stores/metaStore").useMetaStore;
		const mainStore = useMainStore();
		const metaStore = useMetaStore();
		const logOut = require("./utils").logOut;

		// const sidebarCollapsedLocalStorage =
		// 	localStorage.getItem(SIDEBAR_COLLASPED_LOCALSTORAGE) ?? "false";

		// let sidebarCollapsed: Ref<boolean>;
		// try {
		// 	sidebarCollapsed = ref(JSON.parse(sidebarCollapsedLocalStorage));
		// } catch {
		// 	sidebarCollapsed = ref(false);
		// }
		return {
			mainStore,
			metaStore,
			logOut,
			//sidebarCollapsed,
		};
	},
	beforeCreate(): void {
		this.metaStore.initStore();
	},
	mounted() {
		// TODO refactor
		setTimeout(() => {
			this.routerViewPaddingLeft =
				document.getElementById("desktop-nav")?.clientWidth ?? 0;

			const sidebarCollapsedLocalStorage =
				localStorage.getItem(SIDEBAR_COLLASPED_LOCALSTORAGE) ?? "false";

			let sidebarCollapsed;
			try {
				sidebarCollapsed = JSON.parse(sidebarCollapsedLocalStorage);
			} catch {
				sidebarCollapsed = false;
			}

			this.initializingSidebar = true;
			this.sidebarCollapsed = sidebarCollapsed;
			// TODO use on animation end trigger
			setTimeout(() => (this.initializingSidebar = false), 50);
		}, 1);
		// adjust router view padding and width according to screen size breakpoint
		const mq = window.matchMedia("(min-width: 768px)");
		mq.addEventListener("change", event => (this.mediaQueryMd = mq.matches));
		this.mediaQueryMd = mq.matches;
	},
	beforeUnmount() {
		window.removeEventListener("beforeunload", this.beforeWindowUnload);
	},
	components: {
		Spinner,
		Notification,
		Tooltip,
		SideBar,
		AppBar,
		SnackBar,
		ErrorView,
		Btn,
		BreadCrumbs,
	},
	async created() {
		if (this.metaStore.isAuthenticated) {
			try {
				await this.mainStore.getCourses();
				// redirect to student view if attempting to access a teacher view unprivileged
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
			if (newVal) {
				this.typesetTex();
				this.metaStore.dirtyTex = false;
			}
		},
		$route(newVal) {
			if (this.showMobileSidebar) {
				this.onToggleMobileSidebar();
			}
		},
	},
	data() {
		return {
			showUnsavedChangesNotification: false,
			showGamificationPanel: false,
			showMobileSidebar: false,
			routerViewPaddingLeft: 0,
			mediaQueryMd: false,
			initializingSidebar: false,
			sidebarCollapsed: true,
		};
	},
	methods: {
		//logOut,
		onToggleCollapseSidebar() {
			this.sidebarCollapsed = !this.sidebarCollapsed;
			localStorage.setItem(
				SIDEBAR_COLLASPED_LOCALSTORAGE,
				JSON.stringify(this.sidebarCollapsed),
			);
		},
		onToggleMobileSidebar() {
			this.showMobileSidebar = !this.showMobileSidebar;
		},
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
		currentCourse() {
			return this.mainStore.getCourseById(
				this.$router.currentRoute.value.params.courseId as any as string,
			);
		},
		currentCourseName() {
			return this.currentCourse?.name ?? "";
		},
		sidebarOptions(): SidebarOption[] {
			const sidebarOptions = (this.$route.meta?.sidebarOptions ?? []) as SidebarOption[];

			return [
				...sidebarOptions.filter(r => r.routeName !== "StudentCourseList"),
				...(sidebarOptions.filter(r => r.routeName === "StudentCourseList").length === 1
					? [
							{
								...sidebarOptions.filter(r => r.routeName === "StudentCourseList")[0],
								// override path for course list for teachers so it goes to /teacher/courses
								// instead of /student/courses
								...(this.metaStore.user.is_teacher
									? { routeName: "TeacherCourseList" }
									: {}),
							},
					  ]
					: []),
			];
		},
		showSidebar() {
			return ((this.$route.meta?.sidebarOptions ?? []) as SidebarOption[]).length > 0;
		},
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
		showHelpCenterButton() {
			return this.isTeacherRoute;
		},
		showLocaleSelector() {
			return true;
		},
		showSecondaryHeader(): boolean {
			// hide header in routes that have a sidebar
			return (
				!this.$route.matched.map(m => m.name).includes("StudentCourseDashboard") &&
				!this.isTeacherRoute &&
				this.$route.name !== "StudentCourseList"
			);
		},
	},
});
</script>
