<template>
	<div :class="{ 'h-full': tall }">
		<div @mouseup="endDragging()" class="flex space-x-2 relative">
			<div
				:id="resizablePanelId"
				:style="previewPanelStyle"
				class="relative z-10 h-full rounded-t-sm light-input bg-light"
				:class="{ 'opacity-80': disabled, 'w-full': !showPreview }"
			>
				<!-- TODO! make this just a textarea for students-->
				<div
					class="z-10 h-full tex2jax_ignore ql-editor-container"
					:class="[$slots.errors?.() ? 'ql-editor-container-error' : '']"
				>
					<quill-editor
						:options="editorOptions"
						:value="modelValue"
						:disabled="disabled || internalDisabled"
						@change="onEditorChange($event)"
						@ready="onEditorReady($event)"
						v-if="!showBaseEditor && !forceBaseEditor"
					/>
					<textarea
						class="py-3.5 px-3.5 bg-transparent rounded-t-sm outline-none"
						v-else
						rows="8"
						@input="$emit('update:modelValue', $event.target.value)"
						:value="modelValue"
					></textarea>
				</div>
				<label
					class="absolute -z-1 top-2 left-2 origin-0 ql-floating-label"
					:class="{ 'fixed-label': modelValue?.length > 0 }"
				>
					<slot></slot>
				</label>
				<div class="absolute -top-5 right-2">
					<Btn
						:size="'xs'"
						:variant="'primary-borderless'"
						@click="showPreview = !showPreview"
					>
						<p class="text-sm" style="font-weight: 400; font-size: 11px">
							{{ showPreview ? $t("misc.hide_preview") : $t("misc.show_preview") }}
						</p>
					</Btn>
				</div>
				<div v-if="!forceBaseEditor" class="relative z-10 flex w-full hide-in-thumbnail">
					<p
						v-if="showBaseEditor"
						style="font-size: 12px"
						class="ml-auto text-sm text-muted"
					>
						{{ $t("misc.using_base_editor") }}
					</p>
					<Btn
						@click="toggleBaseEditor()"
						:size="'xs'"
						:class="[showBaseEditor ? 'ml-2' : 'ml-auto my-auto -mt-6']"
						:variant="'primary-borderless'"
					>
						<p class="text-sm" style="font-weight: 400; font-size: 11px">
							{{
								showBaseEditor
									? $t("misc.show_full_editor")
									: $t("misc.having_troubles_with_editor")
							}}
						</p></Btn
					>
				</div>
			</div>
			<div
				v-if="showPreview"
				:style="dividerStyle"
				@mousedown="startDragging()"
				style="width: 5px"
				class="absolute resizer h-full top-0 bg-gray-300 bg-opacity-50 z-30"
			></div>
			<span
				v-if="showPreview"
				@mousedown="startDragging()"
				:style="{
					...dividerStyle,
					transform: 'translate(-40%, -50%) rotate(90deg)',
					'font-size': '20px !important',
				}"
				class="absolute opacity-30 resizer top-1/2 z-30 material-icons-outlined"
			>
				drag_handle
			</span>
			<div
				class="px-8 py-2 relative"
				:style="{ width: 100 - previewPanelWidth + '%' }"
				v-if="showPreview"
			>
				<!-- TODO fix overflow with long, uninterrupted words -->
				<div style="white-space: break-spaces" class="w-full" v-html="modelValue" />
			</div>
		</div>

		<div v-if="$slots.errors?.()" class="text-sm font-light text-danger-dark">
			<slot name="errors"></slot>
		</div>
	</div>
</template>

<script lang="ts">
const BORDER_SIZE = 4;
import { texMixin } from "@/mixins";
import { v4 as uuid4 } from "uuid";
import { defineComponent } from "@vue/runtime-core";
import { quillEditor } from "vue3-quill";
import Btn from "./Btn.vue";
export default defineComponent({
	name: "TextEditor",
	props: {
		modelValue: {
			type: String,
			required: true,
		},
		disabled: {
			type: Boolean,
			default: false,
		},
		tall: {
			type: Boolean,
			default: false,
		},
		placeholder: {
			type: String,
			default: "",
		},
		forceBaseEditor: {
			type: Boolean,
			default: false,
		},
		showPreviewButton: {
			type: Boolean,
			default: true,
		},
	},
	mixins: [texMixin],
	components: {
		quillEditor,
		Btn,
	},
	watch: {
		showPreview(newVal) {
			if (newVal) {
				this.triggerTexRender();
			}
		},
		modelValue() {
			if (this.showPreview) {
				if (this.triggerTexHandle !== null) {
					clearTimeout(this.triggerTexHandle);
				}
				this.triggerTexHandle = setTimeout(() => this.triggerTexRender(), 100);
			}
		},
	},
	mounted() {
		// prevent auto-focusing of quill editor
		this.$nextTick(() => (this.internalDisabled = false));
	},
	data() {
		return {
			showBaseEditor: false,
			instance: null as any,
			content: "",
			internalDisabled: true,
			showPreview: false,
			resizablePanelId: uuid4(),
			previewPanelWidth: 50,
			pos: 0,
			triggerTexHandle: null as number | null,
		};
	},
	methods: {
		handleDragging(e: any) {
			const percentage = ((e.pageX - 51) / window.innerWidth) * 100;
			if (percentage >= 30 && percentage <= 70) {
				this.previewPanelWidth = percentage;
			}
		},
		startDragging() {
			document.addEventListener("mousemove", this.handleDragging);
		},
		endDragging() {
			document.removeEventListener("mousemove", this.handleDragging);
		},
		toggleBaseEditor() {
			this.showBaseEditor = !this.showBaseEditor;
		},
		onEditorChange({ quill, html, text }: unknown) {
			this.content = html;
			this.$emit("update:modelValue", html);
		},
		onEditorReady(quill: any) {
			this.$emit("ready", quill);
			quill.on("selection-change", this.onSelectionChange);
			quill.root.addEventListener("blur", () => this.$emit("blur"));
			this.instance = quill;
		},
		onSelectionChange(event: any) {
			if (event) {
				this.$emit("selectionChange", {
					fullText: this.instance.getText(),
					text: this.instance.getText(event.index - 5, event.length + 10),
					range: event,
				});
			}
		},
	},
	computed: {
		previewPanelStyle() {
			if (!this.showPreview) {
				return {};
			}
			return { width: this.previewPanelWidth + "%" };
		},
		dividerStyle() {
			return { left: this.previewPanelWidth + "%" };
		},
		editorOptions() {
			return {
				theme: "snow",
				placeholder: this.placeholder,
				modules: {
					toolbar: [
						["bold", "italic", "underline", "strike"],
						["code-block"],
						//[{ header: 1 }, { header: 2 }],
						[{ list: "ordered" }, { list: "bullet" }],
						//[{ script: 'sub' }, { script: 'super' }],
						//[{ indent: '-1' }, { indent: '+1' }],
						//[{ direction: 'rtl' }],
						// [{ size: ['small', false, 'large', 'huge'] }],
						// [{ header: [1, 2, 3, 4, 5, 6, false] }],
						// [{ color: [] }, { background: [] }],
						// [{ font: [] }],
						// [{ align: [] }],
						// ['clean'],
						[
							"image",
							//'video'
						],
					],
				},
			};
		},
	},
});
</script>
<style>
.resizer {
	cursor: col-resize;
}
</style>
