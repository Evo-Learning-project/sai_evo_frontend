<template>
	<div class="flex flex-col items-center w-full mx-auto mt-16">
		<p style="font-size: 10rem" class="material-icons-outlined opacity-10">
			{{ pageWideErrorData.icon }}
		</p>
		<h2 v-if="!hasCustomMessage" class="opacity-40">{{ pageWideErrorData.title }}</h2>
		<p v-else class="mt-2 mb-4 text-muted text-lg">
			{{ $t("server_messages.error." + pageWideErrorData.content) }}
		</p>
		<Btn class="mt-2" @click="$router.go(0)">{{ $t("errors.retry") }}</Btn>
	</div>
</template>

<script lang="ts">
import { defineComponent } from "@vue/runtime-core";
import { mapState } from "vuex";
import Btn from "@/components/ui/Btn.vue";

const DEFAULT_SERVER_MESSAGES = [
	"You do not have permission to perform this action.",
	"Not found.",
	"Invalid token header. No credentials provided.",
];

export default defineComponent({
	name: "ErrorView",
	computed: {
		...mapState("shared", ["pageWideErrorData"]),
		hasCustomMessage() {
			return (
				(this.pageWideErrorData.content ?? "").length > 0 &&
				!DEFAULT_SERVER_MESSAGES.includes(this.pageWideErrorData.content)
			);
		},
	},
	methods: {},
	components: { Btn },
});
</script>

<style></style>
