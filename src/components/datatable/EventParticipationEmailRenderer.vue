<template>
	<div class="flex items-center">
		<Avatar style="line-height: 1 !important" :user="params.data.user" />
		<div class="flex flex-col space-y-0.5 ml-3 mr-1.5" style="line-height: 1 !important">
			<p>{{ params.data.user.full_name }}</p>
			<p class="text-xs text-muted">{{ params.data.user.email }}</p>
		</div>
		<router-link
			:to="{
				name: 'ExamParticipationFull',
				params: {
					participationId: params.data.id,
					examId: eventId ?? '-1', // prevent 'missing required param' bugs
					courseId: courseId ?? '-1',
				},
			}"
			target="_blank"
			class="mt-1.5"
		>
			<Btn :variant="'icon'" :outline="true" class="p-1" :size="'sm'">
				<span class="material-icons-outlined" style="font-size: 15px !important"
					>launch</span
				>
			</Btn>
		</router-link>
	</div>
</template>

<script lang="ts">
import { courseIdMixin, eventIdMixin } from "@/mixins";
import { EventParticipation } from "@/models";
import { defineComponent, PropType } from "@vue/runtime-core";
import Avatar from "../ui/Avatar.vue";
import Btn from "../ui/Btn.vue";
export default defineComponent({
	name: "EventParticipationEmailRenderer",
	props: {
		params: {
			type: Object as PropType<{
				data: EventParticipation;
				value: string;
			}>,
			required: true,
		},
	},
	mixins: [eventIdMixin, courseIdMixin],
	created() {
		console.log({ params: this.params });
	},
	methods: {},
	computed: {},
	components: { Btn, Avatar },
});
</script>

<style></style>
