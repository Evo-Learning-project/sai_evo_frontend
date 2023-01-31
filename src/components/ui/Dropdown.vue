<template>
	<div class="relative">
		<LinearProgress v-if="loading" class="absolute top-0 rounded-t-sm" />
		<!-- floating label -->
		<label class="absolute top-2 left-1.5 origin-0 fixed-label"><slot></slot></label>
		<DropdownMenu :expanded="expanded" @toggleExpanded="expanded = !expanded">
			<template v-slot:activator>
				<div
					v-wave
					v-if="selectedOption"
					class="
						darken-on-hover
						cursor-pointer
						rounded-t-sm
						border-b-2
						flex
						space-x-2
						overflow-hidden
						items-top
						py-2
						px-3
						light-input
						relative
						z-10
						bg-light
						hover:bg-gray-150
						focus-within:border-primary
						duration-300
						transition-border
					"
				>
					<MultiIcon class="w-6" :icons="selectedOption.icons"></MultiIcon>
					<div>
						<p v-html="selectedOption.content"></p>
					</div>
				</div>
			</template>
			<div class="-my-1.5 w-full">
				<label
					v-wave
					:for="id + '-input-' + index"
					:class="{
						'text-primary-dark bg-primary-light bg-opacity-15':
							option.value == modelValue,
						'hover:bg-gray-200': modelValue != option.value,
					}"
					class="
						py-2.5
						relative
						flex
						px-5
						-mx-5
						items-center
						max-h-screen
						overflow-hidden
						cursor-pointer
					"
					v-for="(option, index) in options"
					:key="id + '-option-' + index"
				>
					<!-- invisible input to handle selection-->
					<input
						@input="onInput(option.value, $event)"
						@click="option.value == modelValue ? (expanded = false) : null"
						class="w-0 h-0 opacity-0"
						type="radio"
						:id="id + '-input-' + index"
						:value="option.value"
						:checked="option.value == modelValue"
					/>
					<div class="flex space-x-2 overflow-hidden items-top">
						<MultiIcon class="w-6" :icons="option.icons"></MultiIcon>
						<div>
							<p
								v-html="option.content"
								:class="{
									'font-semibold':
										option.value == modelValue && (expanded || showFeedback),
								}"
							></p>
							<p
								style="margin-left: -26px"
								v-if="option.description"
								v-html="option.description"
								:class="[
									option.value == modelValue
										? 'text-primary-dark'
										: 'text-muted text-description',
									'text-sm my-1',
								]"
							></p>
						</div>
					</div>
				</label>
			</div>
		</DropdownMenu>
	</div>
</template>

<script lang="ts">
import { defineComponent, PropType } from "@vue/runtime-core";
import { v4 as uuid4 } from "uuid";
import MultiIcon from "@/components/ui/MultiIcon.vue";
import DropdownMenu from "./DropdownMenu.vue";
import { SelectableOption } from "@/interfaces";
import LinearProgress from "./LinearProgress.vue";

export default defineComponent({
	name: "Dropdown",
	props: {
		options: {
			type: Array as PropType<SelectableOption[]>,
			required: true,
		},
		modelValue: {
			required: true,
		},
		loading: {
			type: Boolean,
			default: false,
		},
	},
	components: {
		MultiIcon,
		DropdownMenu,
		LinearProgress,
	},
	created() {
		this.id = uuid4();
		if (this.modelValue != null) {
			this.expanded = false;
		}
	},
	data() {
		return {
			expanded: true,
			showFeedback: false,
			id: "",
		};
	},
	methods: {
		onInput(value: string, inputEvent: Event) {
			console.log("INPUT", value);

			// if (this.modelValue != value) {
			// 	this.expanded = false;
			// 	this.showFeedback = true;
			// 	setTimeout(() => (this.showFeedback = false), 1000);
			// }

			// prevent target from automatically being checked -
			// it will if its value is equal to modelValue

			// eslint-disable-next-line @typescript-eslint/no-extra-semi
			(inputEvent.target as unknown as { checked: boolean }).checked = false;
			inputEvent.preventDefault();
			this.$emit("update:modelValue", value);
			this.expanded = false;
		},
	},
	computed: {
		selectedOption() {
			return this.options.find(o => o.value == this.modelValue);
		},
	},
});
</script>

<style></style>
