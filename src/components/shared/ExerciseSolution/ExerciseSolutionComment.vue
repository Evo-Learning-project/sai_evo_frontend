<template>
	<div class="flex items-center space-x-2">
		<Avatar :size="'xs'" :user="comment.user" />
		<p>{{ comment.content }}</p>
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
