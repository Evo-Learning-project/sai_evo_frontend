<template>
	<div
		class="flex rounded-full bg-primary-light text-primary bg-opacity-30"
		:class="{
			'w-6 h-6 text-sm': size === 'md',
			'w-8 h-8': size === 'sm',
			'w-10 h-10 text-xl': size === 'lg',
		}"
	>
		<p class="mx-auto my-auto font-semibold">
			{{ authorName[0].toLocaleUpperCase() }}
		</p>
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
			type: String as PropType<"sm" | "md" | "lg">,
			default: "md",
		},
	},
	methods: {},
	computed: {
		authorName(): string {
			return this.user?.full_name ?? "Autore";
		},
	},
});
</script>

<style></style>
