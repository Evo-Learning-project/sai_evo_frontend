<template>
	<div>
		<div class="my-4" v-for="node in topLevelNodes" :key="node.id">
			<CourseTreeNode :can-edit="canEditNodes" :node="node" />
		</div>
	</div>
</template>

<script lang="ts">
import CourseTreeNode from "@/components/course_tree/node/CourseTreeNode.vue";
import { courseIdMixin, loadingMixin } from "@/mixins";
import { useMainStore } from "@/stores/mainStore";
import { useMetaStore } from "@/stores/metaStore";
import { defineComponent } from "@vue/runtime-core";
import { mapStores } from "pinia";
export default defineComponent({
	name: "CourseTree",
	props: {},
	mixins: [courseIdMixin, loadingMixin],
	async created() {
		await this.withLoading(async () =>
			this.mainStore.getCourseTopLevelNodes({
				courseId: this.courseId,
				fromFirstPage: true,
			}),
		);
	},
	data() {
		return {};
	},
	methods: {},
	computed: {
		...mapStores(useMainStore, useMetaStore),
		topLevelNodes() {
			return this.mainStore.paginatedTopLevelCourseTreeNodes?.data ?? [];
		},
		canEditNodes() {
			return true;
		},
	},
	components: { CourseTreeNode },
});
</script>

<style></style>
