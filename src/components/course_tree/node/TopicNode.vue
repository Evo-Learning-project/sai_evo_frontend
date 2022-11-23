<template>
	<div class="py-2 px-2 roudned-sm bg-light">
		<h3 class="mb-0">{{ node.name }}</h3>
		<!-- 
		<div v-for="child in node.children.data" :key="child.id">
			<CourseTreeNode v-if="true" :node="child" />
		</div> -->
	</div>
</template>

<script lang="ts">
import { TopicNode } from "@/models";
import { defineComponent, PropType } from "@vue/runtime-core";
import CourseTreeNode from "./CourseTreeNode.vue";
import { nodeProps } from "../shared";
export default defineComponent({
	name: "TopicNode",
	props: {
		node: {
			type: Object as PropType<TopicNode>,
			required: true,
		},
		...nodeProps,
	},

	methods: {},
	computed: {},
	//components: { CourseTreeNode },
});
</script>

<style></style>
