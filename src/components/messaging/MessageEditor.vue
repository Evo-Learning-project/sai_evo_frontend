<template>
	<div class="flex items-center w-full mt-4 space-x-2">
		<Avatar class="" :user="metaStore.user" />
		<TextInput
			@keyup.enter="onSend()"
			class="w-full"
			v-model="draft"
			:placeholder="$t('exercise_solution.add_comment')"
		/>
		<Btn
			:disabled="!isValidMessage"
			:loading="posting"
			:variant="'secondary'"
			@click="onSend()"
		>
			<span class="material-icons">send</span>
		</Btn>
	</div>
</template>

<script lang="ts">
import { useMetaStore } from "@/stores/metaStore";
import { defineComponent, PropType } from "@vue/runtime-core";
import { mapStores } from "pinia";
import Avatar from "../ui/Avatar.vue";
import Btn from "../ui/Btn.vue";
import TextInput from "../ui/TextInput.vue";
export default defineComponent({
	name: "MessageEditor",
	emits: {
		sendMessage({
			message,
			resolveFn,
			rejectFn,
		}: {
			message: string;
			resolveFn: (v: unknown) => void;
			rejectFn: (v: unknown) => void;
		}) {
			return true;
		},
	},
	props: {
		posting: {
			type: Boolean,
			required: true,
		},
	},
	data() {
		return {
			draft: "",
		};
	},
	methods: {
		async onSend() {
			if (!this.isValidMessage) {
				return;
			}
			await new Promise((resolve, reject) => {
				this.$emit("sendMessage", {
					message: this.draft,
					resolveFn: resolve,
					rejectFn: reject,
				});
			});
			this.draft = "";
		},
	},
	computed: {
		...mapStores(useMetaStore),
		isValidMessage() {
			return this.draft.trim().length > 0;
		},
	},
	components: { Avatar, TextInput, Btn },
});
</script>

<style></style>
