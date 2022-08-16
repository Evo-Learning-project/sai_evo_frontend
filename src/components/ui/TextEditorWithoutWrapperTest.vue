<template>
	<div :class="{ 'h-full': tall }">
		<div
			class="relative z-10 h-full rounded-t-sm light-input bg-light"
			:class="{ 'opacity-80': disabled }"
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
					v-if="false && !showBaseEditor"
				/>
				<div v-if="!showBaseEditor" ref="editor"></div>

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
		</div>
		<div class="relative z-10 flex w-full hide-in-thumbnail">
			<p v-if="showBaseEditor" style="font-size: 12px" class="ml-auto text-sm text-muted">
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
		<div v-if="$slots.errors?.()" class="text-sm font-light text-danger-dark">
			<slot name="errors"></slot>
		</div>
	</div>
</template>

<script lang="ts">
import Quill from "quill";
import "quill/dist/quill.core.css";
import "quill/dist/quill.bubble.css";
import "quill/dist/quill.snow.css";
import { defineComponent } from "@vue/runtime-core";
// import { quillEditor } from "vue3-quill";
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
	},
	components: {
		//quillEditor,
		Btn,
	},
	mounted() {
		// prevent auto-focusing of quill editor
		this.$nextTick(() => (this.internalDisabled = false));

		this.editor = new Quill(
			(this.$refs as any).editor,
			this.editorOptions,
			// {
			// 	modules: {
			// 		toolbar: [
			// 			[
			// 				{
			// 					header: [1, 2, 3, 4, false],
			// 				},
			// 			],
			// 			["bold", "italic", "underline", "link"],
			// 		],
			// 	},
			// 	//theme: 'bubble',
			// 	theme: "snow",
			// 	formats: ["bold", "underline", "header", "italic", "link"],
			// 	placeholder: "Type something in here!",
			// }
		);
		this.editor.root.innerHTML = this.modelValue;
		this.editor.on("text-change", () => {
			this.$emit(
				"update:modelValue",
				this.editor.getText() ? this.editor.root.innerHTML : "",
			);
		});
	},
	data() {
		return {
			showBaseEditor: false,
			instance: null as any,
			content: "",
			internalDisabled: true,
			editor: null as any,
		};
	},
	methods: {
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
