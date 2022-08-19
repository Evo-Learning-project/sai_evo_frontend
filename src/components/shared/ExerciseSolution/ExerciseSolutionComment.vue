<template>
	<div class="flex items-center flex-wrap">
		<div class="flex items-center">
			<Avatar :user="comment.user" />
			<p class="ml-2 mr-2 font-medium text-primary capitalize">
				{{ comment.user.full_name ?? "" }}
			</p>
		</div>

		<p class="break-normal">{{ comment.content }}</p>
	</div>
</template>

<script lang="ts">
import { ExerciseSolutionComment } from "@/models";
import { defineComponent, PropType } from "@vue/runtime-core";
import Avatar from "@/components/ui/Avatar.vue";
export default defineComponent({
	name: "ExerciseSolutionComment",
	props: {
		comment: {
			type: Object as PropType<ExerciseSolutionComment>,
			required: true,
		},
	},
	methods: {},
	computed: {},
	components: { Avatar },
});
</script>

<style></style>
