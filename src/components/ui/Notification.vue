<template>
	<div
		style="z-index: 999999"
		class="
			fixed
			w-10/12
			transform
			-translate-x-1/2 -translate-y-1/2
			bg-gray-200
			border
			rounded-md
			shadow-2xl
			bg-opacity-90
			top-1/2
			left-1/2
			md:w-max md:ml-0
		"
	>
		<!-- FIXME review shadow -->
		<div class="flex items-center w-full px-6 py-8 space-x-4">
			<AnimatedIcon v-if="!icon"></AnimatedIcon>
			<div v-else>
				<div class="text-yellow-900 bg-yellow-500 icon-surrounding">
					<span class="ml-px material-icons-outlined">
						{{ icon }}
					</span>
				</div>
			</div>
			<h3 class="mb-0">{{ text || $t("misc.success") }}</h3>
		</div>
	</div>
</template>

<script lang="ts">
import { defineComponent } from "@vue/runtime-core";
import AnimatedIcon from "./AnimatedIcon.vue";

export default defineComponent({
	components: { AnimatedIcon },
	name: "Notification",
	props: {
		icon: {
			type: String,
			default: "",
		},
		text: {
			type: String,
			default: "",
		},
	},
});
</script>

<style></style>
