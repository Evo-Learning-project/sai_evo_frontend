<template>
	<div class="flex flex-col items-center w-full mx-auto mt-16">
		<p style="font-size: 10rem" class="material-icons-outlined opacity-10">
			{{ isMaintenanceMode ? "engineering" : data.icon }}
		</p>
		<p class="mt-2 mb-4 text-muted text-lg" v-if="isMaintenanceMode">
			{{ $t("misc.maintenance_mode") }}
		</p>
		<h2 v-else-if="!hasCustomMessage" class="opacity-40">
			{{ data.title }}
		</h2>
		<p v-else class="mt-2 mb-4 text-muted text-lg">
			{{ $t("server_messages.error." + data.content) }}
		</p>
		<Btn class="mt-2" @click="$router.go(0)">{{ $t("errors.retry") }}</Btn>
	</div>
</template>

<script lang="ts">
import { defineComponent, PropType } from "@vue/runtime-core";
import Btn from "@/components/ui/Btn.vue";
import { isMaintenanceMode, DEFAULT_SERVER_MESSAGES } from "@/utils";
import { ErrorMessage } from "@/interfaces";


export default defineComponent({
	name: "ErrorView",
	props: {
		data: {
			type: Object as PropType<ErrorMessage>,
		},
	},
	computed: {
		isMaintenanceMode() {
			return isMaintenanceMode();
		},
		hasCustomMessage() {
			return (
				(this.data?.content ?? "").length > 0 &&
				!DEFAULT_SERVER_MESSAGES.includes(this.data?.content ?? "")
			);
		},
	},
	methods: {},
	components: { Btn },
});
</script>

<style></style>
