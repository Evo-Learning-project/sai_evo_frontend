<template>
	<div class="relative segmented-controls">
		<label class="absolute top-2 left-3 origin-0 fixed-label"><slot></slot></label>

		<div class="flex w-full">
			<label
				v-wave
				@mousedown="onMouseDown"
				:for="id + '-input-' + index"
				class="
					relative
					flex flex-grow
					max-h-screen
					overflow-hidden overflow-x-hidden overflow-y-hidden
					font-semibold
					text-center text-gray-600
					rounded-md
					cursor-pointer
					min-w-fit
					overflow-ellipsis
					whitespace-nowrap
					items-top
				"
				:class="{
					'py-1.5 px-2': !small,
					'py-0.5 px-1': small,
					'rounded-r-none': index < options.length - 1,
					'rounded-l-none': index !== 0,
					'border border-primary bg-primary bg-opacity-20 text-primary ': option.value == modelValue,
					'border hover:text-gray-800 hover:bg-light': option.value != modelValue,
				}"
				v-for="(option, index) in options"
				:key="id + '-option-' + index"
			>
				<input
					@input="onInput(option.value, $event)"
					class="invisible w-0 h-0"
					type="radio"
					:id="id + '-input-' + index"
					:value="option.value"
					:checked="option.value == modelValue"
					:disabled="disabled"
				/>
				<div class="flex mx-auto space-x-2 items-top">
					<multi-icon v-if="option.icons" class="w-6" :icons="option.icons"></multi-icon>
					<div class="flex flex-col" v-if="option.content.length > 0">
						<p class="" v-html="option.content"></p>
						<!-- <p
              class="mb-2 text-sm text-muted"
              v-if="(option.description?.length ?? 0) > 0"
              v-html="option.description"
            ></p> -->
						<!-- <slot v-bind:description="option.description"></slot> -->
					</div>
				</div>
			</label>
		</div>
	</div>
</template>

<script lang="ts">
import { defineComponent, PropType } from "@vue/runtime-core";
import { v4 as uuid4 } from "uuid";
import MultiIcon from "@/components/ui/MultiIcon.vue";
import { SelectableOption } from "@/interfaces";

export default defineComponent({
	name: "SegmentedControls",
	props: {
		options: {
			type: Array as PropType<SelectableOption[]>,
			required: true,
		},
		modelValue: {
			required: true,
		},
		disabled: {
			type: Boolean,
			default: false,
		},
		small: {
			type: Boolean,
			default: false,
		},
	},
	components: {
		MultiIcon,
	},
	created() {
		this.id = uuid4();
	},
	data() {
		return {
			showFeedback: false,
			id: "",
		};
	},
	methods: {
		onInput(value: string, inputEvent: Event) {
			// eslint-disable-next-line @typescript-eslint/no-extra-semi
			(inputEvent.target as unknown as { checked: boolean }).checked = false;
			inputEvent.preventDefault();
			this.$emit("update:modelValue", value);
		},
	},
});
</script>

<style></style>
