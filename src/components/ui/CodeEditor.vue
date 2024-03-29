<template>
	<div class="relative floating-label" :style="'height: ' + containerHeight + ';'">
		<label class="absolute top-2 left-1.5 origin-0 fixed-label w-full"
			><slot></slot
		></label>

		<div class="flex md:flex-row space-x-1 flex-col md:space-y-0 space-y-2 w-full">
			<div
				class="relative rounded-sm hide-in-thumbnail"
				:class="$slots.sidePane ? 'md:w-7/12 w-full' : 'w-full'"
			>
				<div style="height: inherit" class="absolute flex w-full">
					<div
						v-if="showRunButton"
						class="hide-in-thumbnail top-0 ml-auto h-full z-40 right-0 mt-0.5 mr-4"
					>
						<Btn
							:disabled="running || runCoolDown > 0"
							:variant="'success'"
							@click="$emit('run')"
						>
							<slot name="runButton"></slot>
						</Btn>
					</div>
				</div>
				<MonacoEditor
					v-if="isRendered"
					@editorDidMount="onDidMount($event)"
					@change="onChange($event)"
					@blur="$emit('blur')"
					:value="modelValue"
					theme="vs-dark"
					class="rounded-md"
					:options="monacoOptions"
					:height="baseHeight"
					:language="language"
				/>
				<slot name="bottom"></slot>
			</div>
			<div
				v-if="$slots.sidePane"
				class="code-editor-side-pane flex flex-col w-full md:w-5/12 overflow-hidden"
			>
				<div :id="elementId + 'sidePaneTitle'">
					<slot name="sidePaneTitle"></slot>
				</div>
				<div
					class="
						overflow-x-hidden overflow-y-auto
						rounded-sm rounded-t-none rounded-l-none
					"
					:style="'height:' + sidePaneContentHeight + 'px'"
				>
					<slot name="sidePane"></slot>
				</div>
			</div>
			<!-- </div> -->
		</div>
	</div>
</template>

<script lang="ts">
import MonacoEditor from "@/components/ui/MonacoEditorCustom.vue";
import * as monaco from "monaco-editor";

import { defineComponent } from "@vue/runtime-core";
import { PropType } from "vue";
import Btn from "./Btn.vue";
import { v4 as uuid4 } from "uuid";

export default defineComponent({
	name: "CodeEditor",
	components: {
		MonacoEditor,
		Btn,
	},
	props: {
		modelValue: {
			type: String,
			//required: true,
		},
		runCoolDown: {
			type: Number,
			default: 0,
		},
		running: {
			type: Boolean,
			default: false,
		},
		showRunButton: {
			type: Boolean,
			default: false,
		},
		size: {
			type: String as PropType<"sm" | "md" | "lg">,
			default: "md",
		},
		language: {
			type: String as PropType<"typescript" | "c" | "python">,
			default: "typescript",
		},
	},
	mounted() {
		this.sidePaneContentHeight =
			this.baseHeight -
			(document.getElementById(this.elementId + "sidePaneTitle")?.clientHeight ?? 0);

		// tear down and re-render monaco to keep its width in sync (otherwise)
		// resizing the window gives graphical bugs
		window.addEventListener("resize", () => {
			this.isRendered = false;
			this.$nextTick(() => (this.isRendered = true));
		});
	},
	data() {
		return {
			isRendered: true,
			monacoModule: null as any,
			editorInstance: null as null | monaco.editor.IStandaloneCodeEditor,
			textModel: null as null | monaco.editor.ITextModel,
			monacoOptions: {
				fontSize: 14,
				minimap: {
					scale: 2,
				},
				quickSuggestions: {
					other: true,
					comments: true,
					strings: true,
				},
				parameterHints: {
					enabled: true,
				},

				suggestOnTriggerCharacters: true,
				acceptSuggestionOnEnter: "on",
				tabCompletion: "on",
				wordBasedSuggestions: true,
			},
			elementId: uuid4(),
			sidePaneContentHeight: 0,
		};
	},
	methods: {
		onChange(newVal: string) {
			this.$emit("update:modelValue", newVal);
		},
		onDidMount(event: monaco.editor.IStandaloneCodeEditor) {
			this.editorInstance = event;
			this.textModel = event.getModel();
		},
	},
	computed: {
		baseHeight(): number {
			switch (this.size) {
				case "sm":
					return 150;
				case "md":
					return 200;
				case "lg":
					return 520;
			}
			throw new Error("unreachable");
		},
		editorHeight(): string {
			return this.baseHeight + "px";
		},
		containerHeight(): string {
			return this.baseHeight + "px";
		},
	},
});
</script>
