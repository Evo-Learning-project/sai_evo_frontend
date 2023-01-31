<template>
	<div class="flex p-1" :class="{ 'flex-wrap': wrap }">
		<div v-for="(option, index) in options" :key="'chipset-' + id + '-option-' + index">
			<Tooltip :textValue="option.description" :noArrow="true" :placement="'bottom'">
				<div
					class="font-normal transition-colors duration-75 ease-linear chip"
					:class="{
						'chip-sm': compact,
						'chip-primary': modelValue.includes(option.value),
						'border-0 bg-light': filled && !modelValue.includes(option.value),
						'opacity-50 bg-gray-50': option.disabled,
						'hover:bg-gray-200': !option.disabled && !deletable,
					}"
					v-wave="!option.disabled && !deletable"
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
						:class="{ 'cursor-pointer': !option.disabled && !deletable }"
						class="flex items-center"
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
						<Btn
							@click="onRemove(option.value)"
							class="z-10 ml-1.5 -mr-1.5 bg-gray-200"
							v-if="deletable && !disabled"
							:size="'xs'"
							:variant="'icon'"
							:outline="true"
						>
							<span
								style="font-size: 15px !important; margin-left: 0.5px !important"
								class="material-icons-outlined"
								>close</span
							>
						</Btn>
					</label>
				</div>
			</Tooltip>
		</div>
		<Btn
			@click="$emit('addChip')"
			:variant="'icon'"
			:outline="true"
			v-if="showAddChip && !disabled"
			class="-mt-1 -ml-0.5"
			:tooltip="addChipTooltip"
		>
			<span class="material-icons">add_circle_outline</span>
		</Btn>
	</div>
</template>

<script lang="ts">
import { defineComponent } from "@vue/runtime-core";
import MultiIcon from "@/components/ui/MultiIcon.vue";

import { v4 as uuid4 } from "uuid";
import Tooltip from "./Tooltip.vue";
import Btn from "./Btn.vue";
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
		deletable: {
			type: Boolean,
			default: false,
		},
		disabled: {
			type: Boolean,
			default: false,
		},
		showAddChip: {
			type: Boolean,
			default: false,
		},
		addChipTooltip: {
			type: String,
			default: "",
		},
	},
	components: {
		MultiIcon,
		Tooltip,
		Btn,
	},
	created() {
		this.id = uuid4();
	},
	data() {
		return {
			id: "",
		};
	},
	methods: {
		onRemove(val) {
			// console.log(
			// 	"BEFORE",
			// 	this.proxyModelValue,
			// 	"VAL",
			// 	val,
			// 	"AFTER",
			// 	this.proxyModelValue?.filter(o => o.value != val),
			// );
			//this.proxyModelValue = this.proxyModelValue?.filter(o => o.value != val);
			this.$emit("deleteChip", val);
		},
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
