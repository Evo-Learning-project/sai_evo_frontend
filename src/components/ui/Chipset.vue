<template>
	<div class="flex p-1" :class="{ 'flex-wrap': wrap }">
		<div v-for="(option, index) in options" :key="'chipset-' + id + '-option-' + index">
			<Tooltip :textValue="option.description" :noArrow="true" :placement="'bottom'">
				<div
					class="
						font-normal
						transition-colors
						duration-75
						ease-linear
						cursor-pointer
						chip
						hover:bg-gray-200
					"
					:class="{
						'chip-sm': compact,
						'chip-primary': modelValue.includes(option.value),
						'border-0 bg-light': filled && !modelValue.includes(option.value),
						'opacity-50 bg-gray-50': option.disabled,
					}"
					v-wave="!option.disabled"
				>
					<!-- ring-primary ring-2 text-primary font-semibold -->
					<input
						:type="allowMultiple ? 'checkbox' : 'radio'"
						class="w-0 h-0 opacity-0"
						v-model="proxyModelValue"
						:disabled="option.disabled"
						:id="'chipset-' + id + '-option-' + index"
						:value="option.value"
					/>
					<label
						class="flex items-center cursor-pointer"
						:for="'chipset-' + id + '-option-' + index"
					>
						<MultiIcon
							v-if="option.icons"
							class="w-6 -ml-1"
							:class="[compact ? 'mr-1' : 'mr-2']"
							:icons="option.icons"
							:small="compact"
						></MultiIcon>
						<p v-html="option.content"></p>
						<div class="" v-if="$slots.default">
							<slot v-bind:optionValue="option.value"></slot>
						</div>
					</label></div
			></Tooltip>
		</div>
	</div>
</template>

<script lang="ts">
import { defineComponent } from "@vue/runtime-core";
import MultiIcon from "@/components/ui/MultiIcon.vue";

import { v4 as uuid4 } from "uuid";
import Tooltip from "./Tooltip.vue";
export default defineComponent({
	name: "Chipset",
	props: {
		modelValue: Array,
		value: {
			default: null,
		},
		options: Array,
		allowMultiple: {
			type: Boolean,
			default: true,
		},
		filled: {
			type: Boolean,
			default: false,
		},
		compact: {
			type: Boolean,
			default: false,
		},
		wrap: {
			type: Boolean,
			default: true,
		},
	},
	components: {
		MultiIcon,
		Tooltip,
	},
	created() {
		this.id = uuid4();
	},
	data() {
		return {
			id: "",
		};
	},
	computed: {
		proxyModelValue: {
			get() {
				return this.modelValue;
			},
			set(val: unknown) {
				this.$emit(
					"update:modelValue",
					this.allowMultiple ? val : val === this.modelValue?.[0] ? [] : [val],
				);
			},
		},
	},
});
</script>
