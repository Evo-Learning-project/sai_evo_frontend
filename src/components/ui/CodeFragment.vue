<template>
	<div class="relative">
		<div class="flex items-center absolute top-0 right-0 z-20 semi-transparent">
			<Btn
				:variant="'icon'"
				:outline="true"
				@click="setDark(!dark)"
				:class="{ 'text-lightText': dark }"
			>
				<span style="font-size: 18.5px !important" class="material-icons">{{
					dark ? "light_mode" : "dark_mode"
				}}</span>
			</Btn>
			<CopyToClipboard
				:class="{ 'text-lightText': dark }"
				v-if="!useDefault"
				:icon-only="true"
				:value="value"
				:tooltip="$t('misc.copy')"
			>
				<span
					:class="{ 'text-lightText': dark }"
					style="font-size: 16px !important"
					class="material-icons-outlined"
				>
					content_copy
				</span>
			</CopyToClipboard>
		</div>

		<div class="absolute bottom-0 right-0 z-20 semi-transparent">
			<Btn
				:variant="'icon'"
				:outline="true"
				v-if="collapsible && isTruncated"
				@click="expanded = true"
				><span class="material-icons-outlined text-lightText">expand_more</span></Btn
			>
		</div>
		<div class="rounded-sm overflow-hidden">
			<highlightjs autodetect :code="useDefault ? defaultValue : processedValue" />
		</div>
	</div>
</template>

<script lang="ts">
import { defineComponent, PropType } from "@vue/runtime-core";
//import SshPre from "simple-syntax-highlighter";
import "simple-syntax-highlighter/dist/sshpre.css";
import CopyToClipboard from "./CopyToClipboard.vue";
import Btn from "./Btn.vue";

import hljsVuePlugin from "@highlightjs/vue-plugin";
// import "highlight.js/styles/github-dark.css";

// TODO light theme import "highlight.js/styles/base16/material-lighter.css";
// import "highlight.js/styles/base16/material-darker.css";

import hljs from "highlight.js/lib/core";
import javascript from "highlight.js/lib/languages/javascript";
import typescript from "highlight.js/lib/languages/typescript";
import python from "highlight.js/lib/languages/python";
import c from "highlight.js/lib/languages/c";
import cpp from "highlight.js/lib/languages/cpp";

hljs.registerLanguage("javascript", javascript);
hljs.registerLanguage("typescript", typescript);
hljs.registerLanguage("python", python);
hljs.registerLanguage("c", c);
hljs.registerLanguage("cpp", cpp);

const MAX_COLLAPSED_LENGTH = 500;
const MAX_EXPANDED_LENGTH = 5000;
const MAX_COLLAPSED_LINES = 20;

const LOCALSTORAGE_DARK_THEME_KEY = "highlightjs-code-dark";

export default defineComponent({
	name: "CodeFragment",
	components: {
		//SshPre,
		highlightjs: hljsVuePlugin.component,
		CopyToClipboard,
		Btn,
	},
	props: {
		value: {
			type: String,
			required: true,
		},
		small: {
			type: Boolean,
			default: false,
		},
		language: {
			type: String as PropType<"javascript" | "typescript" | "c" | "python">,
			default: "typescript",
		},
		defaultValue: {
			type: String,
			default: "",
		},
		collapsible: {
			type: Boolean,
			default: false,
		},
	},
	mounted() {
		window.addEventListener(
			`${LOCALSTORAGE_DARK_THEME_KEY}-localstorage-changed`,
			(event: any) => {
				//console.log("ev", event.detail);
				this.updateDark(event.detail.storage);
			},
		);
		try {
			const isDark = JSON.parse(
				localStorage.getItem(LOCALSTORAGE_DARK_THEME_KEY) ?? "true",
			);
			this.updateDark(isDark);
		} catch {
			this.setDark(true);
		}
	},
	watch: {
		// value() {
		// 	// tear down and re-build component as it doesn't update on its own...
		// 	this.show = false;
		// 	this.$nextTick(() => (this.show = true));
		// },
		// processedValue() {
		// 	// tear down and re-build component as it doesn't update on its own...
		// 	this.show = false;
		// 	this.$nextTick(() => (this.show = true));
		// },
	},
	data() {
		return {
			show: true,
			expanded: false,
			dark: false, // can't directly watch localStorage, so use a support variable
		};
	},
	methods: {
		setDark(value: boolean) {
			localStorage.setItem(LOCALSTORAGE_DARK_THEME_KEY, JSON.stringify(value));
			window.dispatchEvent(
				new CustomEvent(`${LOCALSTORAGE_DARK_THEME_KEY}-localstorage-changed`, {
					detail: {
						storage: value,
					},
				}),
			);
			this.updateDark(value);
		},
		updateDark(value: boolean) {
			const themeTitles = ["dark-highlightjs-theme", "light-highlightjs-theme"];
			const activeTheme = value ? themeTitles[0] : themeTitles[1];
			const removeTheme = value ? themeTitles[1] : themeTitles[0];
			this.dark = value;

			// console.log(
			// 	document.querySelector(`link[title="${activeTheme}"]`),
			// 	document.querySelector(`link[title="${removeTheme}"]`),
			// );

			// TODO have some transition
			document.querySelector(`link[title="${activeTheme}"]`)?.removeAttribute("disabled");
			document
				.querySelector(`link[title="${removeTheme}"]`)
				?.setAttribute("disabled", "disabled");

			// this.show = false;
			// this.$nextTick(() => (this.show = true));
		},
	},
	computed: {
		useDefault() {
			return this.value.trim().length === 0;
		},
		isTruncated() {
			return (
				this.collapsible &&
				!this.expanded &&
				(this.value.length > MAX_COLLAPSED_LENGTH ||
					this.processedValueLinesHeight > MAX_COLLAPSED_LINES)
			);
		},
		processedValue(): string {
			if (this.useDefault) {
				return this.defaultValue;
			}
			if (this.expanded || !this.collapsible) {
				return (
					this.value.substring(0, MAX_EXPANDED_LENGTH) +
					(this.value.length > MAX_EXPANDED_LENGTH ? "..." : "")
				);
			}
			const firstLines = this.value.split("\n").slice(0, MAX_COLLAPSED_LINES).join("\n");
			return (
				firstLines.substring(0, MAX_COLLAPSED_LENGTH) + (this.isTruncated ? "..." : "")
			);
		},
		processedValueLinesHeight() {
			return this.value.split("\n").length;
		},
	},
});
</script>

<style></style>
