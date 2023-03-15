<template>
	<div>
		<div class="mb-12 card bg-light" v-if="!integrationEnabled && !firstLoading">
			<div class="w-full flex">
				<img src="@/assets/evo_classroom.png" style="height: 50px" class="mx-auto mb-8" />
			</div>
			<p class="text-lg mb-4">{{ $t("integrations.classroom.introduction") }}</p>
			<div class="ml-2">
				<ul>
					<li
						class="flex items-start space-x-2 my-2"
						v-for="feature in ['exams', 'material', 'roster', 'exam_participations']"
						:key="feature"
					>
						<span class="material-icons text-success">check_circle</span>
						<p>{{ $t("integrations.classroom.feature_" + feature) }}</p>
					</li>
				</ul>
			</div>
		</div>
		<!-- display a button to get authorization if it hasn't been
            granted yet-->
		<GoogleScopeChecker
			class="flex flex-col items-center mt-4"
			:scopes="classroomScopes"
			@scopesOk="scopesVerified = true"
		></GoogleScopeChecker>
		<!-- actual settings once the integration is enabled-->
		<div v-if="scopesVerified" class="mt-4">
			<Toggle :labelOnLeft="true" v-model="integrationEnabled">{{
				$t("integrations.classroom.enable")
			}}</Toggle>
			<!-- integration settings-->
			<div class="mt-12 flex flex-col space-y-4" v-if="integrationEnabled">
				<!-- <p class="">
					{{ currentCourse.name }} {{ $t("integrations.classroom.is_paired_with") }}:
				</p> -->
				<div class="flex flex-col items-center mb-4 mt-4">
					<img src="@/assets/evo_classroom.png" style="height: 40px" />
					<h4 class="font-normal mt-2">
						{{ currentCourse.name }} {{ $t("integrations.classroom.is_paired_with") }}:
					</h4>
					<GoogleClassroomCourseItem :course="twinCourse.data" class="mt-4" />
				</div>
				<div class="mt-8 flex items-center space-x-2 banner banner-light">
					<span class="text-yellow-400 material-icons-outlined"> lightbulb </span>
					<ArticleHandle
						:articleId="''"
						:text="$t('integrations.classroom.find_out_features')"
					></ArticleHandle>
				</div>
			</div>
		</div>

		<Dialog
			@no="showDisableIntegrationDialog = false"
			@yes="onIntegrationDisable()"
			:dismissible="true"
			:showDialog="showDisableIntegrationDialog"
			:warning="true"
			:yesText="disablingIntegration ? $t('misc.wait') : $t('misc.disable')"
			:noText="$t('integrations.classroom.keep_active')"
			:disableOk="disablingIntegration || !disableConfirmCheckSuccess"
		>
			<template v-slot:title>{{ $t("integrations.classroom.disable_title") }}</template>
			<template v-slot:body>
				<p class="mb-2">{{ $t("integrations.classroom.disable_body") }}</p>
				<ul>
					<li
						class="list-disc list-inside"
						v-for="feature in ['exams', 'material', 'roster', 'exam_participations']"
						:key="feature"
					>
						{{ $t("integrations.classroom.feature_" + feature) }}
					</li>
				</ul>
				<div class="banner banner-danger my-4">
					<div>
						<div class="flex space-x-1 items-center">
							<span class="material-icons-outlined"> error_outline </span>
							<h5>{{ $t("misc.warning") }}</h5>
						</div>
						<p>{{ $t("integrations.classroom.disable_warning") }}</p>
					</div>
				</div>
				<div class="flex flex-col space-y-2">
					<p>
						{{ $t("integrations.classroom.type_course_name_to_disable_integration") }}
						&ldquo;<strong>{{ currentCourse.name }}</strong
						>&rdquo;:
					</p>
					<TextInput v-model="disableConfirmText" />
				</div>
			</template>
		</Dialog>

		<Dialog
			:showDialog="showBlockingDialog"
			@yes="resolveBlockingDialog(!(classroomCourses.length === 0))"
			@no="resolveBlockingDialog(false)"
			:yesText="
				creatingCourseTwin
					? $t('misc.wait')
					: classroomCourses.length === 0
					? $t('dialog.default_ok_text')
					: $t('integrations.classroom.pair_course')
			"
			:noText="$t('dialog.default_cancel_text')"
			:confirmOnly="classroomCourses.length === 0"
			:disableOk="
				(classroomCourses.length > 0 && selectedClassroomCourseId === null) ||
				creatingCourseTwin
			"
			:large="true"
		>
			<template v-slot:title>{{
				$t("integrations.classroom.pair_a_classroom_course")
			}}</template>
			<template v-slot:body>
				<Spinner class="mt-4" :size="'xl'" v-if="fetchingClassroomCourses" />
				<div v-else class="">
					<div
						v-if="errorWhileFetchingClassroomCourses"
						class="flex flex-col items-center mt-2 mb-auto"
					>
						<span class="mb-4 opacity-50 material-icons-outlined" style="font-size: 5rem"
							>error_outline</span
						>
						<p class="mb-4 select-none opacity-70">
							{{ $t("misc.an_error_occurred") }}
						</p>
						<Btn class="" @click="fetchClassroomCourses()">{{
							$t("misc.try_again")
						}}</Btn>
					</div>
					<div v-else>
						<p v-if="classroomCourses.length > 0" class="text-muted">
							{{ $t("integrations.classroom.select_course_to_pair") }}
							{{ currentCourse.name }}.
						</p>
						<p v-else>{{ $t("integrations.classroom.you_dont_teach_any_courses") }}</p>
						<!-- selectable Classroom courses-->
						<div class="grid md:grid-cols-3 2xl:grid-cols-4 gap-4 mt-8">
							<GoogleClassroomCourseItem
								tabindex="0"
								:selected="selectedClassroomCourseId === course.id"
								@courseSelected="selectedClassroomCourseId = course.id"
								:course="course"
								v-for="course in classroomCourses"
								:key="course.id"
								:selectable="true"
								:hoverable="true"
							/>
						</div>
					</div>
				</div>
			</template>
		</Dialog>
	</div>
</template>

<script lang="ts">
import GoogleScopeChecker from "@/integrations/components/GoogleScopeChecker.vue";
import { blockingDialogMixin, courseIdMixin, loadingMixin } from "@/mixins";
import { defineComponent, PropType } from "@vue/runtime-core";
import { CLASSROOM_TEACHER_SCOPES } from "@/integrations/classroom/const";
import Toggle from "@/components/ui/Toggle.vue";
import GoogleClassroomCourseItem from "@/integrations/classroom/components/GoogleClassroomCourseItem.vue";
import { mapStores } from "pinia";
import { useGoogleIntegrationsStore } from "@/integrations/stores/googleIntegrationsStore";
import { GoogleClassroomCourseData } from "@/integrations/classroom/interfaces";
import { setErrorNotification } from "@/utils";
import Dialog from "@/components/ui/Dialog.vue";
import Spinner from "@/components/ui/Spinner.vue";
import Btn from "@/components/ui/Btn.vue";
import { useMetaStore } from "@/stores/metaStore";
import ArticleHandle from "@/components/shared/HelpCenter/ArticleHandle.vue";
import TextInput from "@/components/ui/TextInput.vue";
export default defineComponent({
	name: "GoogleClassroomIntegrationSettings",
	props: {},
	mixins: [courseIdMixin, blockingDialogMixin, loadingMixin],
	async created() {
		console.log(this.googleIntegrationStore.createCourseTwin);
		await this.withFirstLoading(
			async () => await this.googleIntegrationStore.getCourseTwin(this.courseId),
		);
	},
	watch: {
		showDisableIntegrationDialog(newVal) {
			if (!newVal) {
				// reset confirm text when dialog gets closed
				this.disableConfirmText = "";
			}
		},
	},
	data() {
		return {
			scopesVerified: false,
			classroomScopes: CLASSROOM_TEACHER_SCOPES,
			selectedClassroomCourseId: null as string | null,
			fetchingClassroomCourses: false,
			creatingCourseTwin: false,
			disablingIntegration: false,
			classroomCourses: [] as GoogleClassroomCourseData[],
			errorWhileFetchingClassroomCourses: false,
			showDisableIntegrationDialog: false,
			disableConfirmText: "",
		};
	},
	methods: {
		async onIntegrationEnable() {
			this.fetchClassroomCourses();
			const choice = await this.getBlockingBinaryDialogChoice();
			if (!choice) {
				this.selectedClassroomCourseId = null;
				this.showBlockingDialog = false;
				return;
			}
			try {
				this.creatingCourseTwin = true;
				await this.googleIntegrationStore.createCourseTwin(
					this.courseId,
					this.selectedClassroomCourseId as string,
				);
				this.metaStore.showSuccessFeedback();
			} catch (e) {
				setErrorNotification(e);
			} finally {
				this.creatingCourseTwin = false;
				this.showBlockingDialog = false;
			}
		},
		async fetchClassroomCourses() {
			this.classroomCourses = [];
			this.errorWhileFetchingClassroomCourses = false;
			this.fetchingClassroomCourses = true;
			try {
				this.classroomCourses =
					await this.googleIntegrationStore.getGoogleClassroomCoursesTaughtByCurrentUser();
			} catch (e) {
				this.errorWhileFetchingClassroomCourses = true;
			} finally {
				this.fetchingClassroomCourses = false;
			}
		},
		async onIntegrationDisable() {
			try {
				await this.googleIntegrationStore.partialUpdateCourseTwin(this.courseId, {
					enabled: false,
				});
				this.showDisableIntegrationDialog = false;
			} catch (e) {
				setErrorNotification(e);
			} finally {
				this.disablingIntegration = false;
			}
		},
	},
	computed: {
		...mapStores(useGoogleIntegrationsStore, useMetaStore),
		integrationEnabled: {
			get() {
				return this.googleIntegrationStore.courseTwins[this.courseId]?.enabled ?? false;
			},
			async set(val: boolean) {
				if (val) {
					await this.onIntegrationEnable();
				} else {
					this.showDisableIntegrationDialog = true;
				}
			},
		},
		twinCourse() {
			return this.googleIntegrationStore.courseTwins[this.courseId];
		},
		disableConfirmCheckSuccess() {
			const normalize = (text: string) => text.trim().toLocaleLowerCase();
			return normalize(this.currentCourse.name) === normalize(this.disableConfirmText);
		},
	},
	components: {
		GoogleScopeChecker,
		Toggle,
		Dialog,
		Spinner,
		GoogleClassroomCourseItem,
		Btn,
		ArticleHandle,
		TextInput,
	},
});
</script>

<style></style>
