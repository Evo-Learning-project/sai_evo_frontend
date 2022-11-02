<template>
	<div class="relative">
		<label class="absolute top-2 z-10 left-1.5 origin-0 fixed-label"><slot></slot></label>
		<div class="tags-input-container">
			<VueTagsInput
				:add-only-from-autocomplete="existingOnly"
				v-model="tag"
				class=""
				:tags="processedModelValue"
				:allow-edit-tags="true"
				:placeholder="$slots.default ? '' : placeholder"
				@before-adding-tag="beforeAddingTag($event)"
				@before-deleting-tag="beforeDeletingTag($event)"
				:autocomplete-items="autoCompleteItems"
				:autocomplete-min-length="
					alwaysShowAutocomplete ? 0 : allowAutocomplete ? 1 : 10000000000000
				"
				:autocomplete-filter-duplicates="false"
			/>
		</div>
	</div>

	<!--@tags-changed="newTags => onTagsChanged(newTags)"-->
</template>

<script lang="ts">
/* eslint-disable @typescript-eslint/no-explicit-any */

import { getTranslatedString as _ } from "@/i18n";
import { Tag } from "@/models";
import VueTagsInput from "@sipec/vue3-tags-input";
import { defineComponent, PropType } from "@vue/runtime-core";

export default defineComponent({
	name: "TagInput",
	components: {
		VueTagsInput,
	},
	watch: {
		serializedProcessedModelValue(_newVal, _oldVal) {
			if (this.ignoreWatcher) {
				return;
			}
			const newVal = JSON.parse(_newVal);
			const oldVal = JSON.parse(_oldVal);

			if (this.addingTag.length > 0 && newVal.length > oldVal.length) {
				this.addingTag = "";
			} else if (this.removingTag.length > 0 && newVal.length < oldVal.length) {
				this.removingTag = "";
			}
		},
	},
	props: {
		modelValue: {
			type: Array as PropType<Tag[]>,
			required: true,
		},
		placeholder: {
			type: String,
			default: _("misc.tags"),
		},
		choices: {
			type: Array as PropType<Tag[]>,
			default: () => [],
		},
		existingOnly: {
			type: Boolean,
			default: false,
		},
		alwaysShowAutocomplete: {
			type: Boolean,
			default: false,
		},
		allowAutocomplete: {
			type: Boolean,
			default: true,
		},
	},
	data() {
		return {
			tag: "",
			addingTag: "",
			removingTag: "",
			ignoreWatcher: false,
		};
	},
	methods: {
		onTagsChanged(newTags: any) {
			this.$emit(
				"update:modelValue",
				newTags.map((t: { text: string }) => this.processTag(t)),
			);
		},
		beforeAddingTag(event: any) {
			if (
				!this.processedModelValue
					.map((t: { text: string; classes?: string }) => t.text)
					.includes(event.tag.text) &&
				(!this.existingOnly ||
					this.autoCompleteItems.map(i => i.text).includes(event.tag.text))
			) {
				this.$emit("addTag", event.tag.text);

				// this triggers ghost tag without having the watcher immediately remove it
				this.ignoreWatcher = true;
				this.addingTag = event.tag.text;
				this.$nextTick(() => (this.ignoreWatcher = false));

				this.tag = "";
			}
		},
		beforeDeletingTag(event: any) {
			this.removingTag = event.tag.text;
			this.$emit("removeTag", event.tag.text);
		},
		processTag(tag: { text: string }) {
			return {
				name: tag.text,
			};
		},
	},
	computed: {
		serializedProcessedModelValue() {
			return JSON.stringify(this.processedModelValue);
		},
		processedModelValue() {
			const ret = this.modelValue.map((t: Tag) => ({
				text: t.name,
				classes: t.name === this.removingTag ? "opacity-50 pointer-events-none" : "",
			}));

			const ghostTag = {
				text: this.addingTag,
				classes: "opacity-50 pointer-events-none",
			};

			return [...ret, ...(this.addingTag.length > 0 ? [ghostTag] : [])];
		},
		processedChoices() {
			return this.choices.map((t: Tag) => ({
				text: t.name,
			}));
		},
		autoCompleteItems(): { text: string; classes?: string }[] {
			const ret = this.processedChoices.filter(
				(c: { text: string }) =>
					c.text.toLowerCase().indexOf(this.tag.toLowerCase()) !== -1,
			);
			if (this.existingOnly || ret.length > 0) {
				return ret;
			}
			return [{ text: this.tag, classes: "create-tag" }];
		},
	},
});
</script>

<style>
.ti-input {
	border: 0 !important; /*1px px solid #ccc;*/
	display: flex;
	padding: 4px;
	flex-wrap: wrap;
	border-top-left-radius: 2px;
	border-top-right-radius: 2px;
}
.tags-input-container {
	border-bottom: 2px solid rgb(229, 231, 235) !important;
	transition-property: border;
	transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
	transition-duration: 150ms;
	transition-duration: 300ms;
}

.tags-input-container:focus-within {
	border-bottom: 2px solid #303f9f !important;
}
</style>
