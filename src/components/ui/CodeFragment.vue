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
export default defineComponent({
	name: "CodeFragment",
	components: {
		SshPre,
		CopyToClipboard,
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
			type: String as PropType<"javascript" | "typescript" | "c">,
			default: "typescript",
		},
		defaultValue: {
			type: String,
			default: "",
		},
	},
	watch: {
		value() {
			// tear down and re-build component as it doesn't update on its own...
			this.show = false;
			this.$nextTick(() => (this.show = true));
		},
	},
	data() {
		return {
			show: true,
		};
	},
	methods: {},
	computed: {
		useDefault() {
			return this.value.trim().length === 0;
		},
		processedValue(): string {
			if (this.useDefault) {
				return this.defaultValue;
			}
			return this.value.substring(0, 20000) + (this.value.length > 20000 ? "..." : "");
		},
	},
});
</script>

<style></style>
