<template>
	<div class="my-8">
		<div
			class="group py-2 relative px-6 mb-2 flex items-center roudned-sm bg-light group"
		>
			<span
				v-if="isDraggable"
				class="
					opacity-0
					group-hover:opacity-50
					transition-opacity
					duration-100
					ease
					absolute
					top-1/2
					transform
					-translate-y-1/2
					left-0
					text-lg
					cursor-move
					drag-handle
					material-icons-outlined
				"
			>
				drag_indicator
			</span>
			<h3 class="mb-0">{{ node.name }}</h3>
			<div v-if="canEdit" class="ml-2 flex flex-grow items-center">
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
				<Btn
					class="
						ml-auto
						opacity-50
						group-hover:opacity-100
						transition-opacity
						duration-100
						ease
					"
					v-if="canEdit"
					@click="
						children.length === 0 &&
							$emit('deleteNode', node) /* TODO shouldn't emit when disabled */
					"
					:disabled="children.length > 0"
					:variant="'icon'"
					:outline="true"
					:tooltip="
						children.length > 0
							? $t('course_tree.cannot_delete_nonempty_topic')
							: $t('misc.delete')
					"
				>
					<span class="text-xl material-icons"> delete </span>
				</Btn>
			</div>
		</div>
		<div
			v-for="child in children"
			:key="child.id"
			class="mx-2 my-2 hidden-in-dragging-element"
		>
			<CourseTreeNode
				:isDraggable="false"
				@editNode="$emit('editNode', $event)"
				@deleteNode="$emit('deleteNode', $event)"
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
