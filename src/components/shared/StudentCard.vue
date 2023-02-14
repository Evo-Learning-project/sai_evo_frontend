<template>
	<Card :margin-less="true">
		<template v-slot:header>
			<div class="flex items-center w-full mt-2">
				<div class="flex items-center space-x-4">
					<Avatar :size="'lg'" :user="user" />
					<div class="flex flex-col -space-y-1">
						<p class="">{{ user.full_name }}</p>
						<div class="flex items-center space-x-1">
							<p class="text-sm text-muted">{{ user.email }}</p>
							<a style="margin-bottom: -4.85px" :href="'mailto:' + user.email">
								<Btn :size="'xs'" :variant="'icon'" :outline="true">
									<span
										style="font-size: 14px !important"
										class="material-icons-outlined icon-light"
									>
										email
									</span>
								</Btn>
							</a>
						</div>
					</div>
				</div>
				<Btn
					class="ml-auto"
					:outline="true"
					:variant="'icon'"
					@click="expanded = !expanded"
					><span
						class="
							transition-transform
							duration-200
							ease-out
							transform
							material-icons-outlined
						"
						:class="{ 'rotate-180': expanded }"
					>
						expand_more
					</span>
				</Btn>
			</div>
		</template>
		<template v-slot:body>
			<div
				class="duration-200 ease-in-out transition-max-height"
				:class="{
					'max-h-0 overflow-hidden': !expanded,
					'max-h-96 overflow-y-auto': expanded,
				}"
			>
				<SkeletonCard :border-less="true" class="-ml-4" v-if="fetching"></SkeletonCard>
				<Timeline
					v-else
					class="mt-4"
					:steps="processedHistory"
					v-slot="{ timestamp, eventType, data }"
				>
					<div class="text-sm text-muted">
						<Timestamp :value="timestamp"></Timestamp>
					</div>
					<div class="flex items-center space-x-1">
						<p>
							{{ $t("course_insights.user_history_event_descriptions." + eventType) }}
							<strong v-if="eventType === EventType.EXAM">{{ data.name }}</strong>
						</p>
						<router-link
							:to="{
								name: 'ExamParticipationFull',
								params: { examId: data.examId, participationId: data.id },
							}"
							target="_blank"
						>
							<Btn :outline="true" :variant="'icon'"
								><span style="font-size: 18px !important" class="material-icons-outlined"
									>launch</span
								></Btn
							>
						</router-link>
					</div>
				</Timeline>
				<p v-if="processedHistory.length === 0 && !fetching" class="text-muted">
					{{ $t("course_insights.no_user_activity") }}
				</p>
			</div>
		</template>
	</Card>
</template>

<script lang="ts">
import { EventParticipation, EventType, User } from "@/models";
import { defineComponent, PropType } from "@vue/runtime-core";
import Card from "../ui/Card.vue";
import Btn from "../ui/Btn.vue";
import Timeline from "../ui/Timeline.vue";
import Timestamp from "../ui/Timestamp.vue";
import { getUserCourseParticipations } from "@/api/courses";
import { courseIdMixin, loadingMixin } from "@/mixins";
import SkeletonCard from "../ui/SkeletonCard.vue";
import { setErrorNotification } from "@/utils";
import Avatar from "../ui/Avatar.vue";
export default defineComponent({
	name: "StudentCard",
	mixins: [courseIdMixin, loadingMixin],
	props: {
		user: {
			type: Object as PropType<User>,
			required: true,
		},
	},
	watch: {
		async expanded(newVal) {
			if (newVal && this.participationHistory.length === 0) {
				this.fetching = true;
				try {
					this.participationHistory = await getUserCourseParticipations(
						this.courseId,
						this.user.id,
					);
				} catch (e) {
					setErrorNotification(e);
				} finally {
					this.fetching = false;
				}
			}
		},
	},
	data() {
		return {
			fetching: false,
			expanded: false,
			participationHistory: [] as EventParticipation[],
			EventType,
		};
	},
	methods: {},
	computed: {
		processedHistory() {
			return this.participationHistory
				.map(p => ({
					eventType: p.event.event_type,
					timestamp: p.begin_timestamp,
					data: {
						id: p.id,
						name: p.event.name,
						examId: p.event.id,
						class:
							p.event.event_type === EventType.SELF_SERVICE_PRACTICE ? "opacity-50" : "",
					},
				}))
				.sort((a, b) => (new Date(a.timestamp) < new Date(b.timestamp) ? -1 : 1));
		},
	},
	components: { Card, Btn, Timeline, Timestamp, SkeletonCard, Avatar },
});
</script>

<style></style>
