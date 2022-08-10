<template>
	<div>
		<Card
			:class="{
				'bg-primary-light bg-opacity-0': isParticipable,
				'md:h-23rem h-64':
					participation.event.event_type === EventType.SELF_SERVICE_PRACTICE,
				'h-44': participation.event.event_type !== EventType.SELF_SERVICE_PRACTICE,
			}"
		>
			<!-- 334 x 371 -->
			<template v-slot:header>
				<h3 class="text-center" v-if="participation.event.name.length > 0">
					{{ participation.event.name }}
				</h3>
				<div class="flex mx-auto font-medium text-muted">
					<p class="mx-auto space-x-1">
						<span class="hidden inline-icon material-icons-outlined light-icon">
							event
						</span>
						<Timestamp
							:value="participation.begin_timestamp"
							:date-only="true"
						></Timestamp>
					</p>
					<div v-if="isParticipable" class="hidden chip mx-auto chip-primary mb-0 pt-0.5">
						<span class="material-icons-outlined text-base mr-1 mt-1.25px"> update </span>
						{{ $t("student_course_dashboard.pending") }}
					</div>
				</div>
			</template>
			<template v-slot:body>
				<div class="flex flex-col h-full">
					<img class="hidden my-4" src="../../../public/thumb.png" />

					<!-- thumbnail -->
					<div
						class=""
						v-if="participation.event.event_type === EventType.SELF_SERVICE_PRACTICE"
					>
						<ParticipationThumbnail
							:participation="participation"
						></ParticipationThumbnail>
					</div>
					<!-- separator border -->
					<div
						v-if="participation.event.event_type === EventType.SELF_SERVICE_PRACTICE"
						class="h-0 -mx-4 border-b md:-mx-5"
					></div>
					<!-- bottom section with buttons -->
					<div class="flex items-center mt-auto -mb-1 bg-black bg-opacity-0">
						<div class="" v-if="isParticipable">
							<!-- resume button -->
							<router-link
								class="order-12 md:mt-6 xl:mt-0 xl:order-1"
								:to="{
									name:
										participation.event.event_type === EventType.SELF_SERVICE_PRACTICE
											? 'PracticeParticipationPage'
											: 'ExamParticipationPage',
									params: {
										examId: participation.event.id,
										courseId: courseId,
									},
								}"
							>
								<Btn :variant="'primary'" :outline="false" :size="'sm'">
									<span class="mr-2 text-lg material-icons-outlined"> update </span>
									{{ $t("student_course_dashboard.resume") }}
								</Btn>
							</router-link>
						</div>
						<div class="flex -mt-0.5" v-else>
							<!-- summary/assessment button -->
							<router-link
								v-if="participation.assessment_available"
								:to="{
									name:
										participation.event.event_type === EventType.SELF_SERVICE_PRACTICE
											? 'PracticeSummaryPage'
											: 'AssessmentReviewPage',
									params: {
										participationId: participation.id,
										examId: participation.event.id,
										courseId: courseId,
									},
								}"
							>
								<Btn :size="'sm'" :variant="'primary-borderless'">
									{{
										participation.event.event_type === EventType.SELF_SERVICE_PRACTICE
											? $t("student_course_dashboard.practice_summary")
											: $t("student_course_dashboard.view_assessment")
									}}</Btn
								>
							</router-link>
							<!-- review button -->
							<router-link
								v-if="participation.event.event_type !== EventType.SELF_SERVICE_PRACTICE"
								:to="{
									name: 'SubmissionReviewPage',
									params: {
										participationId: participation.id,
										examId: participation.event.id,
										courseId: courseId,
									},
								}"
							>
								<Btn :size="'sm'" :variant="'primary-borderless'">{{
									$t("student_course_dashboard.review_submission")
								}}</Btn>
							</router-link>
						</div>
						<Btn
							:tooltip="
								participation.bookmarked
									? $t('student_course_dashboard.remove_bookmark')
									: $t('student_course_dashboard.add_bookmark')
							"
							v-if="participation.event.event_type === EventType.SELF_SERVICE_PRACTICE"
							@click="$emit('bookmark')"
							:loading="loading"
							:variant="'icon'"
							:outline="true"
							class="my-0 ml-auto"
							><span
								class="material-icons"
								:class="{ 'text-primary': participation.bookmarked }"
								>{{ participation.bookmarked ? "bookmark" : "bookmark_outline" }}</span
							></Btn
						>
					</div>
				</div>
			</template>
		</Card>
	</div>
</template>

<script lang="ts">
import {
	EventParticipation,
	EventParticipationState,
	EventState,
	EventType,
} from "@/models";
import { defineComponent, PropType } from "@vue/runtime-core";
import Card from "../ui/Card.vue";
import Timestamp from "../ui/Timestamp.vue";
import Btn from "../ui/Btn.vue";
import { courseIdMixin } from "@/mixins";
import ParticipationThumbnail from "./ParticipationThumbnail.vue";

export default defineComponent({
	name: "EventParticipationPreview",
	props: {
		participation: {
			type: Object as PropType<EventParticipation>,
			required: true,
		},
		loading: {
			type: Boolean,
			default: false,
		},
	},
	mixins: [courseIdMixin],
	data() {
		return {
			EventType,
		};
	},
	computed: {
		isParticipable(): boolean {
			return (
				this.participation.event.state === EventState.OPEN &&
				this.participation.state === EventParticipationState.IN_PROGRESS
			);
		},
	},
	components: {
		Card,
		Timestamp,
		Btn,
		ParticipationThumbnail,
	},
});
</script>

<style></style>
