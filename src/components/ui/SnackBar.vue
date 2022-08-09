<template>
	<div style="z-index: 9999" class="fixed bottom-3 left-0">
		<div
			class="
				w-full
				px-4
				py-3
				rounded
				opacity-100
				shadow-popup
				text-lightText
				bg-dark bg-opacity-95
				border-danger-dark
			"
			role="alert"
		>
			<div class="flex items-center space-x-2">
				<div class="material-icons-outlined">
					{{ icon }}
				</div>
				<div>
					<p class="">{{ message }}</p>
					<!--<p class="text-sm">Make sure you know how these changes affect you.</p>-->
				</div>
			</div>
		</div>
	</div>
</template>

<script lang="ts">
import { defineComponent } from "@vue/runtime-core";

export default defineComponent({
	name: "SnackBar",
	props: {
		icon: {
			type: String,
			default: "",
		},
		message: {
			type: String,
			required: true,
		},
	},
});
</script>

<style></style>
