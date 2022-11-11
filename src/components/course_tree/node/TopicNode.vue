<template>
	<div class="border card">
		TopicNode {{ node.name }}

		<div v-for="child in node.children.data" :key="child.id">
			<CourseTreeNode v-if="true" :node="child" />
		</div>
	</div>
</template>

<script lang="ts">
import { TopicNode } from "@/models";
import { defineComponent, PropType } from "@vue/runtime-core";
import CourseTreeNode from "./CourseTreeNode.vue";
export default defineComponent({
	name: "TopicNode",
	props: {
		node: {
			type: Object as PropType<TopicNode>,
			required: true,
		},
	},

	methods: {},
	computed: {},
	components: { CourseTreeNode },
});
</script>

<style></style>
