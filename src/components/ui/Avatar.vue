<template>
	<div
		v-if="showFallbackavatar || !user.avatar_url"
		class="flex rounded-full bg-primary-light text-primary bg-opacity-30"
		:style="avatarSize"
	>
		<p class="mx-auto my-auto font-semibold">
			{{ fullName[0].toLocaleUpperCase() }}
		</p>
	</div>
	<div :style="avatarSize" class="flex rounded-full overflow-hidden" v-else>
		<img
			referrerpolicy="no-referrer"
			@error="showFallbackavatar = true"
			:src="user.avatar_url"
		/>
	</div>
</template>

<script lang="ts">
import { User } from "@/models";
import { defineComponent, PropType } from "@vue/runtime-core";
export default defineComponent({
	name: "Avatar",
	props: {
		user: {
			type: Object as PropType<User>,
			default: () => ({}),
		},
		size: {
			type: String as PropType<"sm" | "md" | "lg" | "xl">,
			default: "md",
		},
	},
	data() {
		return {
			showFallbackavatar: false,
		};
	},
	methods: {},
	computed: {
		fullName(): string {
			return this.user?.full_name || this.user?.email || "A";
		},
		avatarSize() {
			const size = this.size === "md" ? "2rem" : this.size === "lg" ? "2.4rem" : "3.5rem";
			return `min-width: ${size} !important;
			min-height: ${size} !important;
			max-width: ${size} !important;
			max-height: ${size} !important`;
		},
	},
});
</script>

<style></style>
