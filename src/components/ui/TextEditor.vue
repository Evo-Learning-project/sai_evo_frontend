<template>
	<div :class="{ 'h-full': tall }" :id="id">
		<div @mouseup="endDragging()" class="flex space-x-2 relative">
			<div
				:id="resizablePanelId"
				:style="previewPanelStyle"
				class="relative z-10 h-full rounded-t-sm light-input darken-on-hover bg-light"
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
				<div class="absolute -top-5 right-0">
					<Btn
						:size="'xs'"
						:variant="'primary-borderless'"
						@click="showPreview = !showPreview"
						v-show="containsLatex"
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
						v-if="showBaseEditor"
						:size="'xs'"
						class="ml-2"
						:variant="'primary-borderless'"
					>
						<p class="text-sm" style="font-weight: 400; font-size: 11px">
							{{ $t("misc.show_full_editor") }}
						</p>
					</Btn>
				</div>
			</div>
			<div
				v-if="showPreview"
				:style="dividerStyle"
				@mousedown="startDragging()"
				style="width: 5px; transition-property: background"
				class="
					absolute
					resizer
					h-full
					top-0
					bg-gray-300
					hover:bg-opacity-70
					duration-150
					delay-75
					bg-opacity-50
					z-30
				"
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
				<div
					style="white-space: break-spaces"
					class="w-full"
					v-html="stripHtmlFromLaTexBlocks(modelValue)"
				/>
			</div>
		</div>

		<div v-if="$slots.errors?.()" class="text-sm font-light text-danger-dark">
			<slot name="errors"></slot>
		</div>
		<div class="hidden" :id="id + 'latex-button-src'">
			<svg
				style="width: 16px !important"
				xmlns="http://www.w3.org/2000/svg"
				viewBox="0 0 24 24"
			>
				<title>{{ $t("misc.insert_latex") }}</title>
				<path
					class="ql-stroke"
					style="stroke-width: 0.5 !important; fill: unset; stroke: #444"
					d="M12.42,5.29C11.32,5.19 10.35,6 10.25,7.11L10,10H12.82V12H9.82L9.38,17.07C9.18,19.27 7.24,20.9 5.04,20.7C3.79,20.59 2.66,19.9 2,18.83L3.5,17.33C3.83,18.38 4.96,18.97 6,18.63C6.78,18.39 7.33,17.7 7.4,16.89L7.82,12H4.82V10H8L8.27,6.93C8.46,4.73 10.39,3.1 12.6,3.28C13.86,3.39 15,4.09 15.66,5.17L14.16,6.67C13.91,5.9 13.23,5.36 12.42,5.29M22,13.65L20.59,12.24L17.76,15.07L14.93,12.24L13.5,13.65L16.35,16.5L13.5,19.31L14.93,20.72L17.76,17.89L20.59,20.72L22,19.31L19.17,16.5L22,13.65Z"
				/>
			</svg>
		</div>
		<div class="hidden" :id="id + 'html-button-src'">
			<svg
				xmlns="http://www.w3.org/2000/svg"
				enable-background="new 0 0 24 24"
				height="35px"
				viewBox="0 0 24 24"
				width="35px"
				style="
					fill: currentColor;
					margin-bottom: -2px;
					margin-left: -10px;
					transform: scale(1.25);
				"
			>
				<title>{{ $t("misc.show_base_editor") }}</title>

				<g><rect fill="none" height="35" width="35" /></g>
				<g>
					<path
						class="ql-stroke"
						style="stroke-width: 0.25 !important; fill: unset; stroke: #444"
						d="M3.5,9H5v6H3.5v-2.5h-2V15H0V9h1.5v2h2V9z M17.5,9H13c-0.55,0-1,0.45-1,1v5h1.5v-4.5h1V14H16v-3.51h1V15h1.5v-5 C18.5,9.45,18.05,9,17.5,9z M11,9H6v1.5h1.75V15h1.5v-4.5H11V9z M24,15v-1.5h-2.5V9H20v6H24z"
					/>
				</g>
			</svg>
		</div>
	</div>
</template>

<script lang="ts">
const BORDER_SIZE = 4;
import { texMixin } from "@/mixins";
import { v4 as uuid4 } from "uuid";
import { defineComponent } from "@vue/runtime-core";

import { quillEditor } from "vue3-quill";

import Quill from "quill";
const ImageResize = require("quill-image-resize").default;
const ImageDrop = require("quill-image-drop-module").ImageDrop;
import MagicUrl from "quill-magic-url";

Quill.register("modules/magicUrl", MagicUrl);
Quill.register("modules/imageDrop", ImageDrop);
Quill.register("modules/imageResize", ImageResize);

import Btn from "./Btn.vue";
import { containsLatex, stripHtmlFromLaTexBlocks } from "@/utils";
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
		showBaseEditor(newVal) {
			this.$nextTick(this.addCustomButtons);
		},
	},
	mounted() {
		// prevent auto-focusing of quill editor
		this.$nextTick(() => (this.internalDisabled = false));
		this.addCustomButtons();
	},
	data() {
		return {
			showBaseEditor: false,
			instance: null as any,
			//content: "",
			internalDisabled: true,
			showPreview: false,
			resizablePanelId: uuid4(),
			previewPanelWidth: 50,
			pos: 0,
			triggerTexHandle: null as number | null,
			id: "a" + uuid4(), // https://github.com/testing-library/dom-testing-library/issues/168,
		};
	},
	methods: {
		handleDragging(e: any) {
			const percentage = ((e.pageX - 51) / window.innerWidth) * 100;
			if (percentage >= 30 && percentage <= 70) {
				this.previewPanelWidth = percentage;
			}
		},
		addCustomButtons() {
			// add custom LaTeX button
			const latexButton = document.querySelector("#" + this.id + " .ql-latex");
			if (latexButton) {
				// when clicked, the LaTeX button inserts two $'s and positions the cursor between them
				latexButton.addEventListener("click", () => {
					const selection = this.instance.getSelection(true);
					this.instance.insertText(selection.index, "$$");
					this.instance.setSelection(selection.index + 1, 0);
				});
				latexButton.innerHTML = document.getElementById(`${this.id}latex-button-src`)
					?.innerHTML as string;
			}
			// add custom html button
			const htmlButton = document.querySelector("#" + this.id + " .ql-html");
			if (htmlButton) {
				// when clicked, the html button toggles between full & base editor
				htmlButton.addEventListener("click", () => {
					this.toggleBaseEditor();
				});
				htmlButton.innerHTML = document.getElementById(`${this.id}html-button-src`)
					?.innerHTML as string;
			}
		},
		stripHtmlFromLaTexBlocks,
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
			//this.content = html;
			console.log({ quill, html, text });
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
		containsLatex() {
			return containsLatex(this.modelValue);
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
						["image"], // "video"
						["clean"],
						["latex"],
						["html"],
					],
					imageResize: {
						modules: ["Resize", "DisplaySize"],
					},
					imageDrop: true,
					magicUrl: true,
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
