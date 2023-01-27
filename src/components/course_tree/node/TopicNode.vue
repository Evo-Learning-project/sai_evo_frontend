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
		<!-- <div
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
		</div> -->

		<draggable
			ghost-class="drag-ghost"
			drag-class="dragging-element"
			:modelValue="children"
			handle=".drag-handle"
			item-key="id"
			@start="onNodeDragStart($event)"
			@end="onNodeDragEnd($event)"
			animation="200"
			class="hidden-in-dragging-element"
		>
			<template #item="{ element }">
				<div class="my-2 mx-2.5">
					<CourseTreeNode
						:isDraggable="canEdit"
						@editNode="$emit('editNode', $event)"
						@deleteNode="$emit('deleteNode', $event)"
						:canEdit="canEdit"
						:node="element"
					/>
				</div>
			</template>
		</draggable>

		<VueEternalLoading v-if="!initialFetch" :load="onLoadMore">
			<template #loading>
				<Spinner />
			</template>
			<template #no-more> &nbsp; </template>
		</VueEternalLoading>
		<Spinner v-if="initialFetch" />
	</div>
</template>

<script lang="ts">
import draggable from "vuedraggable";

import { TopicNode } from "@/models";
import { defineComponent, PropType } from "@vue/runtime-core";
import CourseTreeNode from "./CourseTreeNode.vue";
import { nodeEmits, nodeProps } from "../shared";
import { mapStores } from "pinia";
import { useMainStore } from "@/stores/mainStore";
import Btn from "@/components/ui/Btn.vue";
import VueEternalLoading from "@ts-pro/vue-eternal-loading/src/components/VueEternalLoading/VueEternalLoading.vue";
import { LoadAction } from "@ts-pro/vue-eternal-loading";
import { setErrorNotification } from "@/utils";
import Spinner from "@/components/ui/Spinner.vue";
import { courseIdMixin } from "@/mixins";
import { onChangeNodePosition } from "@/components/course_tree/shared";

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
	mixins: [courseIdMixin],
	async created() {
		await new Promise((resolve, reject) =>
			this.$emit("loadChildren", {
				node: this.node,
				fromFirstPage: true,
				resolveFn: resolve,
				rejectFn: reject,
			}),
		);
		this.initialFetch = false;
	},
	data() {
		return {
			initialFetch: true,
			draggingChild: false,
		};
	},
	methods: {
		async onNodeDragStart() {
			this.draggingChild = true;
		},
		async onNodeDragEnd(event: { oldIndex: number; newIndex: number }) {
			this.draggingChild = false;
			try {
				await onChangeNodePosition(
					this.courseId,
					this.children,
					event.oldIndex,
					event.newIndex,
				);
			} catch (e) {
				setErrorNotification(e);
			}
		},
		async onLoadMore({ loaded, noMore, error }: LoadAction) {
			console.log("loading children");
			try {
				const moreResults: boolean = await new Promise((resolve, reject) =>
					// pass resolve/reject to parent and wait for resolution
					this.$emit("loadChildren", {
						node: this.node,
						fromFirstPage: false,
						resolveFn: resolve,
						rejectFn: reject,
					}),
				);
				if (!moreResults) {
					noMore();
				} else {
					loaded();
				}
			} catch (e) {
				setErrorNotification(e);
				error();
			}
		},
	},
	computed: {
		...mapStores(useMainStore),
		children() {
			return this.mainStore.paginatedChildrenByNodeId[this.node.id]?.data ?? [];
		},
	},
	components: { draggable, CourseTreeNode, Btn, VueEternalLoading, Spinner },
});
</script>

<style></style>
