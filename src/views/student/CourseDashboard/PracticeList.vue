<template>
	<div class="mb-4">
		<div class="w-full">
			<!-- top buttons -->
			<div class="flex items-center -mt-12">
				<Btn
					:class="{
						'opacity-0': firstLoading || mainStore.practiceParticipations.length <= 3,
					}"
					:variant="'icon'"
					:outline="true"
					class="ml-auto"
					@click="showBookmarkedOnly = !showBookmarkedOnly"
					:tooltip="
						showBookmarkedOnly
							? $t('student_course_dashboard.show_all_practices')
							: $t('student_course_dashboard.show_bookmarked')
					"
					><span
						:class="[showBookmarkedOnly ? 'material-icons' : 'material-icons-outlined']"
						>bookmarks</span
					></Btn
				>
			</div>
			<!-- ads -->
			<div
				v-show="ads3Code || adsMobileCode"
				class="relative w-full bg-light py-2 mb-6 mt-4 px-2"
			>
				<p
					class="
						select-none
						uppercase
						text-muted text-xs
						mt-2
						mr-2
						absolute
						top-0
						right-0
					"
				>
					{{ $t("misc.ads") }}
				</p>
				<div v-show="ads3Code" class="hidden lg:block" v-html="ads3Code"></div>
				<div v-show="adsMobileCode" class="lg:hidden" v-html="adsMobileCode"></div>
			</div>

			<div
				class="
					grid grid-cols-1
					gap-4
					xl:gap-8
					md:grid-cols-2
					lg:grid-cols-4
					2xl:grid-cols-5
				"
				v-if="!firstLoading"
			>
				<!-- resume practice button -->
				<!-- <div v-if="(currentCourse.unstarted_practice_events?.length ?? 0) > 0">
					<Card
						:hoverable="false"
						:margin-less="true"
						class="
							relative
							h-40
							overflow-hidden
							text-gray-600
							cursor-pointer
							md:h-23rem
							elevate-when-pressed
							bg-light
						"
						v-wave
						@click="onResumePractice(currentCourse.unstarted_practice_events[0])"
					>
						<template v-slot:header>
							<div class="absolute w-full transform -translate-x-1/2 left-1/2">
								<h2 class="text-center opacity-70">
									{{ $t("student_course_dashboard.draft_practice") }}
								</h2>
							</div>
						</template>
						<template v-slot:body>
							<div class="flex flex-col h-full">
								<h1 class="mx-auto my-auto text-7xl opacity-70 material-icons-outlined">
									redo
								</h1>
							</div>
						</template>
					</Card>
				</div> -->

				<!-- new practice button -->
				<Card
					id="create-practice-btn"
					:margin-less="true"
					:hoverable="false"
					:filled="true"
					:border-less="true"
					class="
						relative
						overflow-hidden
						text-gray-600
						cursor-pointer
						md:h-23rem
						h-64
						elevate-when-pressed
						bg-light
						hover:bg-gray-200
						transition-all
						duration-300
						ease-in-out
					"
					v-wave
					@click="onCreatePractice()"
				>
					<template v-slot:header>
						<div class="absolute w-full transform -translate-x-1/2 left-1/2">
							<h2 class="text-center opacity-70">
								{{ $t("student_course_dashboard.new_practice") }}
							</h2>
						</div>
					</template>
					<template v-slot:body>
						<div class="flex flex-col h-full">
							<h1 class="mx-auto my-auto text-7xl opacity-70 material-icons-outlined">
								add
							</h1>
						</div>
					</template>
				</Card>

				<!-- <div class="card card-border card-hoverable">
					<div v-html="ads2Code"></div>
				</div> -->

				<!-- preview list -->
				<EventParticipationPreview
					v-for="participation in filteredPracticeParticipations"
					:key="'practice-participation-' + participation.id"
					:participation="participation"
					@bookmark="onBookmark(participation)"
					:loading="loadingParticipations.has(participation.id)"
				/>
			</div>
			<!-- skeletons -->
			<div
				class="
					mt-4
					w-full
					grid grid-cols-1
					gap-4
					xl:gap-8
					md:grid-cols-2
					lg:grid-cols-4
					2xl:grid-cols-5
				"
				v-else
			>
				<SkeletonCard :full="true" />
				<SkeletonCard :full="true" />
				<SkeletonCard :full="true" />
				<SkeletonCard :full="true" />
			</div>
			<VueEternalLoading
				v-if="!firstLoading"
				:load="onLoadMore"
				class="mt-8"
				v-model:is-initial="isInitialInfiniteLoad"
			>
				<template #loading>
					<Spinner />
				</template>
				<template #no-more>
					&nbsp;
					<!-- <div class="w-full h-1 bg-gray-200 rounded-md"></div> -->
				</template>
			</VueEternalLoading>
		</div>

		<!-- editor dialog-->
		<Dialog
			@no="onCancelPracticeEditorDialog()"
			@yes="onBeginPractice()"
			:noText="$t('dialog.default_cancel_text')"
			:yesText="
				practiceEditorDialogLoading
					? $t('misc.wait')
					: $t('practice_template_editor.begin_practice')
			"
			:fullWidth="mainStore.tags.length > 0"
			:disableOk="
				practiceEditorDialogLoading ||
				draftEventTemplate.rules.length === 0 ||
				isEditingRule
			"
			:showDialog="showPracticeEditorDialog"
			:loading="practiceEditorDialogLoading"
		>
			<template v-slot:title>
				{{
					isResumingUnstartedPractice
						? $t("student_course_dashboard.resume_practice")
						: $t("student_course_dashboard.new_practice")
				}}
			</template>
			<template v-slot:body>
				<p class="mb-4 text-muted">
					{{
						mainStore.tags.length > 0
							? $t("practice_template_editor.choose_tags_text")
							: $t("practice_template_editor.choose_exercises_no_tag_text")
					}}
				</p>
				<PracticeTemplateEditorNew
					v-model="draftEventTemplate"
					@isEditing="isEditingRule = $event"
				></PracticeTemplateEditorNew>
				<p
					v-if="totalRuleAmount > MAX_PRACTICE_EXERCISE_COUNT && !isEditingRule"
					class="text-danger-dark"
				>
					{{
						$t("student_course_dashboard.too_many_exercises") +
						" " +
						MAX_PRACTICE_EXERCISE_COUNT +
						"."
					}}
				</p>
			</template>
		</Dialog>
		<v-tour name="demoStudentTour" :steps="demoStudentTourSteps" :options="tourOptions" />
	</div>
</template>

<script lang="ts">
/* eslint-disable @typescript-eslint/no-extra-semi */
/* eslint-disable @typescript-eslint/no-explicit-any */

import { adComponentMixin, courseIdMixin, loadingMixin } from "@/mixins";
import { defineComponent } from "@vue/runtime-core";

import EventParticipationPreview from "@/components/student/EventParticipationPreview.vue";
import SkeletonCard from "@/components/ui/SkeletonCard.vue";
import Card from "@/components/ui/Card.vue";
import {
	Event,
	EventParticipation,
	EventType,
	getBlankEventTemplate,
	getBlankPractice,
} from "@/models";
import Dialog from "@/components/ui/Dialog.vue";
import { getTranslatedString as _ } from "@/i18n";
import { sum } from "lodash";
import { demoStudentTourSteps, MAX_PRACTICE_EXERCISE_COUNT, tourOptions } from "@/const";
import Btn from "@/components/ui/Btn.vue";
import VueEternalLoading from "@ts-pro/vue-eternal-loading/src/components/VueEternalLoading/VueEternalLoading.vue";
import Spinner from "@/components/ui/Spinner.vue";
import { LoadAction } from "@ts-pro/vue-eternal-loading";
import { EventParticipationSearchFilter } from "@/api";
import { isDemoMode, setErrorNotification } from "@/utils";
import { logAnalyticsEvent } from "@/utils";
import { mapStores } from "pinia";
import { useMainStore } from "@/stores/mainStore";
import PracticeTemplateEditorNew from "../../../components/student/PracticeTemplateEditorNew.vue";

const DEMO_TOUR_KEY = "demo_student_tour_taken";

export default defineComponent({
	components: {
		EventParticipationPreview,
		SkeletonCard,
		Card,
		Dialog,
		Btn,
		VueEternalLoading,
		Spinner,
		PracticeTemplateEditorNew,
	},
	name: "PracticeList",
	mixins: [courseIdMixin, loadingMixin, adComponentMixin],
	async created() {
		await this.withFirstLoading(async () => {
			await this.mainStore.getTags({
				courseId: this.courseId,
				includeExerciseCount: true,
			});
			// await this.mainStore.getCourse({ courseId: this.courseId });
			await this.mainStore.getCourseEventParticipations({
				courseId: this.courseId,
				fromFirstPage: true,
				filter: {
					event_type: EventType.SELF_SERVICE_PRACTICE,
				} as EventParticipationSearchFilter,
			});
			if (isDemoMode() && !(DEMO_TOUR_KEY in localStorage)) {
				setTimeout(() => ((this as any).$tours["demoStudentTour"] as any).start(), 50);
				localStorage.setItem(DEMO_TOUR_KEY, "true");
			}
		});
	},
	data() {
		return {
			isInitialInfiniteLoad: false,
			isEditingRule: false,
			MAX_PRACTICE_EXERCISE_COUNT,
			showNotRecent: true,
			showBookmarkedOnly: false,
			loadingParticipations: new Set<string>(),
			tourOptions,
			demoStudentTourSteps,
			showPracticeEditorDialog: false,
			draftEventTemplate: getBlankEventTemplate(),
			practiceEditorDialogLoading: false,
		};
	},
	methods: {
		async onLoadMore({ loaded, noMore, error }: LoadAction) {
			try {
				const moreResults = await this.mainStore.getCourseEventParticipations({
					courseId: this.courseId,
					fromFirstPage: false,
					filter: {
						event_type: EventType.SELF_SERVICE_PRACTICE,
					} as EventParticipationSearchFilter,
				});

				if (!moreResults) {
					noMore();
				} else {
					loaded();
				}
			} catch {
				error();
			}
		},
		onCreatePractice() {
			/**
			 * Open practice editor dialog and lets user define the practice template
			 */
			logAnalyticsEvent("createPractice", { courseId: this.courseId });
			if (this.loading) {
				return;
			}
			if (this.currentCourse.public_exercises_count === 0) {
				// TODO if you use this.setErrorNotification, it's undefined - investigate
				setErrorNotification(_("student_course_dashboard.no_public_exercises"), true);
				return;
			}
			this.showPracticeEditorDialog = true;
		},
		async onBeginPractice() {
			/**
			 * Create practice event using defined template and redirect to
			 * practice participation page
			 */
			logAnalyticsEvent("beginPractice", { courseId: this.courseId });

			const eventPayload = {
				...getBlankPractice(),
				template: this.draftEventTemplate,
			};

			try {
				this.practiceEditorDialogLoading = true;

				// create practice event with draftEventTemplate
				const newPracticeEvent = await this.mainStore.createEvent({
					courseId: this.courseId,
					event: eventPayload,
				});

				this.$router.push({
					name: "PracticeParticipationPage",
					params: {
						examId: newPracticeEvent.id,
					},
				});
			} catch (e) {
				setErrorNotification(e);
			} finally {
				this.practiceEditorDialogLoading = false;
			}
		},
		onCancelPracticeEditorDialog() {
			this.showPracticeEditorDialog = false;
		},
		async onBookmark(participation: EventParticipation) {
			try {
				logAnalyticsEvent("bookmarkedPractice", { courseId: this.courseId });
				this.loadingParticipations.add(participation.id);
				await this.mainStore.partialUpdateEventParticipation({
					courseId: this.courseId,
					// TODO assumes participation contains Event
					eventId: participation.event.id,
					participationId: participation.id,
					changes: {
						bookmarked: !(participation.bookmarked ?? false),
					},
				});
			} catch (e) {
				setErrorNotification(e);
			} finally {
				this.loadingParticipations.delete(participation.id);
			}
		},
	},
	computed: {
		...mapStores(useMainStore),
		filteredPracticeParticipations() {
			return this.mainStore.practiceParticipations.filter(
				(p, i) =>
					(this.showNotRecent || i < 3 || (p.bookmarked && this.showBookmarkedOnly)) &&
					(!this.showBookmarkedOnly || p.bookmarked),
			);
		},
		isResumingUnstartedPractice(): boolean {
			return (
				this.mainStore.editingEvent?.id ===
				this.currentCourse.unstarted_practice_events?.[0]?.id
			);
		},
		totalRuleAmount(): number {
			if (!this.mainStore.editingEvent) {
				return 0;
			}
			return sum(
				(this.mainStore.editingEvent as Event).template?.rules.map(r =>
					parseInt(String(r.amount)),
				),
			);
		},
	},
});
</script>

<style></style>
