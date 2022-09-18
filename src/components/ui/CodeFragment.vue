<template>
	<div class="relative">
		<CopyToClipboard
			v-if="!useDefault"
			:icon-only="true"
			:value="value"
			:tooltip="$t('misc.copy')"
			class="absolute top-0 right-0 z-20 semi-transparent"
		>
			<span
				style="font-size: 16px !important"
				class="material-icons-outlined text-lightText"
			>
				content_copy
			</span>
		</CopyToClipboard>
		<div class="absolute bottom-0 right-0 z-20 semi-transparent">
			<Btn
				:variant="'icon'"
				:outline="true"
				v-if="collapsible && isTruncated"
				@click="expanded = true"
				><span class="material-icons-outlined text-lightText">expand_more</span></Btn
			>
		</div>

		<SshPre
			v-if="show"
			:language="'js'"
			:dark="true"
			:class="{ 'ssh-pre-small': small }"
			>{{ useDefault ? defaultValue : processedValue }}</SshPre
		>
	</div>
</template>

<script lang="ts">
import { defineComponent, PropType } from "@vue/runtime-core";
import SshPre from "simple-syntax-highlighter";
import "simple-syntax-highlighter/dist/sshpre.css";
import CopyToClipboard from "./CopyToClipboard.vue";
import Btn from "./Btn.vue";

const MAX_COLLAPSED_LENGTH = 500;
const MAX_EXPANDED_LENGTH = 5000;
const MAX_COLLAPSED_LINES = 20;

export default defineComponent({
	name: "CodeFragment",
	components: {
		SshPre,
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
	watch: {
		value() {
			// tear down and re-build component as it doesn't update on its own...
			this.show = false;
			this.$nextTick(() => (this.show = true));
		},
		processedValue() {
			// tear down and re-build component as it doesn't update on its own...
			this.show = false;
			this.$nextTick(() => (this.show = true));
		},
	},
	data() {
		return {
			show: true,
			expanded: false,
		};
	},
	methods: {},
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
