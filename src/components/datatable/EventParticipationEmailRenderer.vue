<template>
	<div class="flex items-center">
		<router-link
			:to="{
				name: 'ExamParticipationFull',
				params: { participationId: params.data.id },
			}"
			target="_blank"
			class="mt-1.5"
		>
			<Btn :variant="'icon'" :outline="true" class="mr-1.5 p-1" :size="'xs'">
				<span class="material-icons-outlined" style="font-size: 15px !important"
					>launch</span
				>
			</Btn>
		</router-link>
		<!-- <Btn :variant="'icon'" :outline="true" class="mr-1.5 p-1" :size="'xs'">
			<svg style="width: 20px; height: 20px" viewBox="0 0 24 24">
				<path
					fill="currentColor"
					d="M4,8H8V4H20V16H16V20H4V8M16,8V14H18V6H10V8H16M6,12V18H14V12H6Z"
				/>
			</svg>
		</Btn> -->
		{{ params.value }}
	</div>
</template>

<script lang="ts">
import { EventParticipation } from "@/models";
import { defineComponent, PropType } from "@vue/runtime-core";
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
	methods: {},
	computed: {},
	components: { Btn },
});
</script>

<style></style>
