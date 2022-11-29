<template>
	<div class="my-8">
		<div class="py-2 px-6 mb-2 flex items-center roudned-sm bg-light group">
			<h3 class="mb-0">{{ node.name }}</h3>
			<div v-if="canEdit" class="ml-2">
				<Btn
					class="
						icon-btn-primary
						opacity-50
						group-hover:opacity-100
						transition-opacity
						duration-100
						ease
					"
					@click="$emit('editNode', node)"
					:variant="'icon'"
					:outline="true"
					:tooltip="$t('misc.edit')"
				>
					<span class="material-icons">edit</span>
				</Btn>
			</div>
		</div>
		<div v-for="child in children" :key="child.id" class="mx-2">
			<CourseTreeNode
				@editNode="$emit('editNode', $event)"
				:canEdit="canEdit"
				:node="child"
			/>
		</div>
	</div>
</template>

<script lang="ts">
import { TopicNode } from "@/models";
import { defineComponent, PropType } from "@vue/runtime-core";
import CourseTreeNode from "./CourseTreeNode.vue";
import { nodeEmits, nodeProps } from "../shared";
import { mapStores } from "pinia";
import { useMainStore } from "@/stores/mainStore";
import Btn from "@/components/ui/Btn.vue";
export default defineComponent({
	name: "TopicNode",
	props: {
		node: {
			type: Object as PropType<TopicNode>,
			required: true,
		},
		...nodeProps,
	},
	emits: {
		...nodeEmits,
	},
	created() {
		this.$emit("loadChildren", { node: this.node, fromFirstPage: true });
	},
	methods: {},
	computed: {
		...mapStores(useMainStore),
		children() {
			return this.mainStore.paginatedChildrenByNodeId[this.node.id]?.data ?? [];
		},
	},
	components: { CourseTreeNode, Btn },
});
</script>

<style></style>
