<template>
	<div>
		<div class="flex items-center space-x-3 mb-12">
			<img src="@/assets/classroom.png" style="width: 35px" />
			<h3>Google Classroom</h3>
		</div>
		<!-- display a button to get authorization if it hasn't been
            granted yet-->
		<GoogleScopeChecker
			class="flex flex-col items-center"
			:scopes="classroomScopes"
			@scopesOk="scopesVerified = true"
		></GoogleScopeChecker>
		<!-- actual settings once the integration is enabled-->
		<div v-if="scopesVerified">
			<Toggle :labelOnLeft="true" v-model="integrationEnabled">{{
				$t("integrations.classroom.enable")
			}}</Toggle>
		</div>
		<!-- integration settings-->
		<div class="mt-8 flex flex-col space-y-4" v-if="integrationEnabled">
			<p class="">
				{{ currentCourse.name }} {{ $t("integrations.classroom.is_paired_with") }}:
			</p>
			<GoogleClassroomCourseItem :course="twinCourse.data" />
		</div>
		<Dialog
			:showDialog="showBlockingDialog"
			@yes="resolveBlockingDialog(true)"
			@no="resolveBlockingDialog(false)"
			:yesText="creatingCourseTwin ? $t('misc.wait') : $t('dialog.default_ok_text')"
			:noText="$t('dialog.default_cancel_text')"
			:disableOk="selectedClassroomCourseId === null || creatingCourseTwin"
			:large="true"
		>
			<template v-slot:title>{{
				$t("integrations.classroom.pair_a_classroom_course")
			}}</template>
			<template v-slot:body>
				<Spinner :size="'xl'" v-if="fetchingClassroomCourses" />
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
						<p class="text-muted">
							{{ $t("integrations.classroom.select_course_to_pair") }}
							{{ currentCourse.name }}.
						</p>
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
							></GoogleClassroomCourseItem>
						</div>
					</div>
				</div>
			</template>
		</Dialog>
	</div>
</template>

<script lang="ts">
import GoogleScopeChecker from "@/integrations/components/GoogleScopeChecker.vue";
import { blockingDialogMixin, courseIdMixin } from "@/mixins";
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
export default defineComponent({
	name: "GoogleClassroomIntegrationSettings",
	props: {},
	mixins: [courseIdMixin, blockingDialogMixin],
	async created() {
		console.log(this.googleIntegrationStore.createCourseTwin);
		await this.googleIntegrationStore.getCourseTwin(this.courseId);
	},
	data() {
		return {
			scopesVerified: false,
			classroomScopes: CLASSROOM_TEACHER_SCOPES,
			selectedClassroomCourseId: null as string | null,
			fetchingClassroomCourses: false,
			creatingCourseTwin: false,
			classroomCourses: [] as GoogleClassroomCourseData[],
			errorWhileFetchingClassroomCourses: false,
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
			await this.googleIntegrationStore.partialUpdateCourseTwin(this.courseId, {
				enabled: false,
			});
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
					await this.onIntegrationDisable();
				}
			},
		},
		twinCourse() {
			return this.googleIntegrationStore.courseTwins[this.courseId];
		},
	},
	components: {
		GoogleScopeChecker,
		Toggle,
		Dialog,
		Spinner,
		GoogleClassroomCourseItem,
		Btn,
	},
});
</script>

<style></style>
