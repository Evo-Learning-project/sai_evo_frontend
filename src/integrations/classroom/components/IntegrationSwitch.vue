<template>
	<div class="flex items-center space-x-2">
		<img src="@/assets/classroom.png" style="width: 30px" />
		<Toggle
			:labelOnLeft="true"
			:modelValue="modelValue"
			@update:modelValue="$emit('update:modelValue', $event)"
		>
			<slot>{{ $t("integrations.classroom.publish_on_classroom") }}</slot>
		</Toggle>
	</div>
</template>

<script lang="ts">
import Toggle from "@/components/ui/Toggle.vue";
import { defineComponent, PropType } from "@vue/runtime-core";
export default defineComponent({
	name: "IntegrationSwitch",
	props: {
		modelValue: {
			type: Boolean,
			required: true,
		},
	},
	methods: {},
	computed: {},
	components: { Toggle },
});
</script>

<style></style>
