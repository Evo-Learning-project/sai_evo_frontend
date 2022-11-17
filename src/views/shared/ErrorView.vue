<template>
	<div class="flex flex-col items-center w-full mx-auto mt-16">
		<p style="font-size: 10rem" class="material-icons-outlined opacity-10">
			{{ isMaintenanceMode ? "engineering" : metaStore.pageWideErrorData.icon }}
		</p>
		<p class="mt-2 mb-4 text-muted text-lg" v-if="isMaintenanceMode">
			{{ $t("misc.maintenance_mode") }}
		</p>
		<h2 v-else-if="!hasCustomMessage" class="opacity-40">
			{{ metaStore.pageWideErrorData.title }}
		</h2>
		<p v-else class="mt-2 mb-4 text-muted text-lg">
			{{ $t("server_messages.error." + metaStore.pageWideErrorData.content) }}
		</p>
		<Btn class="mt-2" @click="$router.go(0)">{{ $t("errors.retry") }}</Btn>
	</div>
</template>

<script lang="ts">
import { defineComponent } from "@vue/runtime-core";
import Btn from "@/components/ui/Btn.vue";
import { isMaintenanceMode } from "@/utils";
import { mapStores } from "pinia";
import { useMetaStore } from "@/stores/metaStore";

const DEFAULT_SERVER_MESSAGES = [
	"You do not have permission to perform this action.",
	"Not found.",
	"Invalid token header. No credentials provided.",
];

export default defineComponent({
	name: "ErrorView",
	computed: {
		...mapStores(useMetaStore),
		isMaintenanceMode() {
			return isMaintenanceMode();
		},
		hasCustomMessage() {
			return (
				(this.metaStore.pageWideErrorData?.content ?? "").length > 0 &&
				!DEFAULT_SERVER_MESSAGES.includes(this.metaStore.pageWideErrorData?.content ?? "")
			);
		},
	},
	methods: {},
	components: { Btn },
});
</script>

<style></style>
