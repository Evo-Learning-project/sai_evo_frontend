<template>
	<div>
		<!-- top row -->
		<div class="flex w-full items-center mb-12">
			<Btn :variant="'icon'" :outline="true" class="-ml-2"
				><span class="material-icons-outlined" @click="$emit('closeEditor')">
					close</span
				></Btn
			>
			<h1 class="mb-0 ml-2 mr-auto">
				{{
					isExistingNode
						? $t("course_tree.update_topic_title")
						: $t("course_tree.new_topic_title")
				}}
			</h1>
		</div>

		<!-- editor -->
		<div>
			<TextInput
				:modelValue="modelValue.name"
				@update:modelValue="onNodeChange('name', $event, false)"
				>{{ $t("course_tree.topic_node_name") }}</TextInput
			>
		</div>

		<!-- buttons -->
		<div class="flex w-full mt-4">
			<Btn
				:disabled="blockingSaving"
				@click="onSave()"
				:variant="'primary-borderless'"
				class="ml-auto"
				>{{
					blockingSaving
						? $t("misc.wait")
						: isExistingNode
						? $t("course_tree.save")
						: $t("course_tree.create")
				}}</Btn
			>
			<Btn
				:disabled="blockingSaving"
				@click="$emit('closeEditor')"
				:variant="'primary-borderless'"
				class="-mr-6"
				>{{ $t("dialog.default_cancel_text") }}</Btn
			>
		</div>
	</div>
</template>

<script lang="ts">
import Btn from "@/components/ui/Btn.vue";
import TextInput from "@/components/ui/TextInput.vue";
import { getTranslatedString as _ } from "@/i18n";
import { courseIdMixin, savingMixin } from "@/mixins";
import { CourseTreeNode, TopicNode } from "@/models";
import { useMainStore } from "@/stores/mainStore";
import { useMetaStore } from "@/stores/metaStore";
import { defineComponent, PropType } from "@vue/runtime-core";
import { mapStores } from "pinia";
import { nodeEditorEmits, nodeEditorProps } from "../shared";
export default defineComponent({
	name: "TopicNodeEditor",
	props: {
		modelValue: {
			type: Object as PropType<TopicNode>,
			required: true,
		},
		...nodeEditorProps,
	},
	emits: {
		...nodeEditorEmits,
	},
	mixins: [courseIdMixin, savingMixin],
	data() {
		return {};
	},
	async created() {
		await this.mainStore.getCourseRootId({ courseId: this.courseId });
	},
	methods: {
		onNodeChange<K extends keyof CourseTreeNode>(
			key: any, //K,
			value: any, //CourseTreeNode[K],
			save = false,
		) {
			// TODO extract shared behavior (mixin?)
			this.$emit("patchNode", { key, value, save });
		},
		onSave() {
			this.$emit("save");
		},
		onBlur() {
			this.$emit("blur");
		},
	},
	computed: {
		...mapStores(useMainStore, useMetaStore),
	},
	components: {
		TextInput,
		Btn,
	},
});
</script>

<style></style>
