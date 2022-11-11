<template>
	<div>
		<p>CourseTree</p>
		<div v-for="node in nodes ?? []" :key="node.id">
			<CourseTreeNode :node="node" />
		</div>
	</div>
</template>

<script lang="ts">
import { getCourseTopLevelNodes } from "@/api/course_tree";
import CourseTreeNode from "@/components/course_tree/node/CourseTreeNode.vue";
import { courseIdMixin, loadingMixin } from "@/mixins";
import { CourseTreeNode as ICourseTreeNode } from "@/models";
import { defineComponent, PropType } from "@vue/runtime-core";
export default defineComponent({
	name: "CourseTree",
	props: {},
	mixins: [courseIdMixin, loadingMixin],
	async created() {
		await this.withLoading(
			async () => (this.nodes = (await getCourseTopLevelNodes(this.courseId, 1)).data),
		);
	},
	data() {
		return {
			nodes: null as null | ICourseTreeNode[],
		};
	},
	methods: {},
	computed: {},
	components: { CourseTreeNode },
});
</script>

<style></style>
