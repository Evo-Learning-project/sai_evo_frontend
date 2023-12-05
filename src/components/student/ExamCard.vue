<template>
	<div>
		<Card class="md:h-23rem h-64">
			<!-- 334 x 371 -->
			<template v-slot:header>
				<h3 style="line-height: 1.2">
					{{ event.name }}
				</h3>
			</template>
			<template v-slot:body>
				<div class="flex flex-col h-full">
					<!-- description -->
					<div class="flex-grow" v-html="event.instructions" />
					<!-- time limit -->
					<div class="flex place-content-between my-4">
						<!-- time limit -->
						<div
							class="flex items-center space-x-2"
							v-if="event.time_limit_rule === EventTimeLimitRule.TIME_LIMIT"
						>
							<span class="material-icons-outlined opacity-70">timer </span>
							<p>
								<span v-if="event.time_limit_seconds >= 3600">
									{{ formattedTime.hours }}:
								</span>
								{{ formattedTime.minutes }}:{{ formattedTime.seconds }}
							</p>
						</div>
						<!-- tags -->
						<div v-if="false">
							<Tag :tag="{ name: 'Entry Level' }" />
						</div>
					</div>
					<!-- thumbnail -->
					<div class="" v-if="false">
						<ParticipationThumbnail :participation="null" />
					</div>
					<!-- separator border -->
					<div class="h-0 -mx-4 mb-3 border-b md:-mx-5" />
					<!-- bottom section with buttons -->
					<div
						class="
							flex
							place-content-between
							items-center
							mt-auto
							-mb-1
							bg-black bg-opacity-0
						"
					>
						<div class="" v-if="isParticipable">
							<!-- resume button -->
							<router-link
								class="order-12 md:mt-6 xl:mt-0 xl:order-1"
								:to="{
									name: 'ExamParticipationPage',
									params: {
										examId: event.id,
										courseId: courseId,
									},
								}"
							>
								<Btn :variant="'primary'" :outline="false" :size="'sm'">
									<!-- <span class="mr-2 text-lg material-icons-outlined"> update </span> -->
									{{ $t("student_course_dashboard.begin_exam") }}
								</Btn>
							</router-link>
						</div>
						<CopyToClipboard
							:icon-only="true"
							:tooltip="$t('exercise_solution.share')"
							:value="permalink"
						/>
					</div>
				</div>
			</template>
		</Card>
	</div>
</template>

<script lang="ts">
import { Event, EventState, EventTimeLimitRule, EventType } from "@/models";
import { defineComponent, PropType } from "@vue/runtime-core";
import Card from "../ui/Card.vue";
import Btn from "../ui/Btn.vue";
import { courseIdMixin } from "@/mixins";
import ParticipationThumbnail from "./ParticipationThumbnail.vue";
import CopyToClipboard from "../ui/CopyToClipboard.vue";
import { getExamPermalink } from "../../utils";
import Tag from "../ui/Tag.vue";

export default defineComponent({
	name: "EventParticipationPreview",
	props: {
		event: {
			type: Object as PropType<Event>,
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
			EventTimeLimitRule,
		};
	},
	computed: {
		isParticipable(): boolean {
			return this.event.state === EventState.OPEN;
		},
		showThumbnail(): boolean {
			return false; //this.participation.event.event_type === EventType.SELF_SERVICE_PRACTICE;
		},
		// TODO make this a utility to avoid duplication with Countdown.vue
		formattedTime(): {
			hours: string;
			minutes: string;
			seconds: string;
		} {
			const hours = Math.floor((this.event.time_limit_seconds ?? 0) / 3600);
			const minutes = Math.floor(
				((this.event.time_limit_seconds ?? 0) - hours * 3600) / 60,
			);
			const seconds = (this.event.time_limit_seconds ?? 0) - minutes * 60 - hours * 3600;

			return {
				hours: String(hours).padStart(2, "0"),
				minutes: String(minutes).padStart(2, "0"),
				seconds: String(seconds).padStart(2, "0"),
			};
		},
		permalink(): string {
			return getExamPermalink(this.event);
		},
	},
	components: {
		Card,
		Btn,
		ParticipationThumbnail,
		CopyToClipboard,
		Tag,
	},
});
</script>

<style></style>
