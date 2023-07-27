<template>
	<div>
		<div class="flex items-center space-x-2.5 py-1">
			<div class="relative">
				<img src="@/assets/classroom.png" style="width: 30px" />
			</div>
			<div class="flex items-center space-x-1">
				<component
					:is="remoteObjectUrl ? 'a' : 'p'"
					:class="{ 'hover:underline cursor-pointer': remoteObjectUrl }"
					target="_blank"
					:href="remoteObjectUrl"
				>
					<slot>{{ $t("integrations.classroom.published_on_classroom") }}</slot>
				</component>
				<span style="font-size: 18px !important" class="material-icons text-success"
					>done</span
				>
			</div>
		</div>
	</div>
</template>

<script lang="ts">
import { defineComponent, PropType } from "@vue/runtime-core";
export default defineComponent({
	name: "PublishedOnClassroom",
	props: {
		remoteObjectUrl: {
			type: String,
			default: "",
		},
	},
	methods: {},
	computed: {},
});
</script>

<style></style>
