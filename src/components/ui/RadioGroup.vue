<template>
	<div class="relative">
		<label class="absolute top-2 left-1.5 origin-0 fixed-label"><slot></slot></label>

		<div class="w-full">
			<label
				:for="id + '-input-' + index"
				class="
					relative
					flex
					my-0.5
					max-h-screen
					space-x-1.5
					cursor-pointer
					items-start
					radio-item
				"
				:class="{ 'radio-container': !disabled }"
				v-for="(option, index) in options"
				:key="id + '-option-' + index"
			>
				<div
					v-wave-trigger:radio
					v-wave="disabled ? false : { trigger: 'radio', color: '#666ad1' }"
					class="
						absolute
						w-12
						h-12
						transition-all
						duration-100
						ease-in-out
						rounded-full
						bg-opacity-10 bg-primary
						radio-shadow
					"
				></div>

				<input
					@input="onInput(option.value, $event)"
					style="min-width: 15px; min-height: 15px"
					class="mt-5px input-radio"
					type="radio"
					:id="id + '-input-' + index"
					:value="option.value"
					:checked="option.value == modelValue"
					:disabled="disabled"
				/>

				<div class="flex items-start space-x-2">
					<MultiIcon v-if="option.icons" class="w-6" :icons="option.icons"></MultiIcon>
					<div class="flex flex-col">
						<p class="" v-html="option.content"></p>
						<slot name="item" v-bind:description="option.description"></slot>
					</div>
				</div>
			</label>
		</div>
	</div>
</template>

<script lang="ts">
import { defineComponent } from "@vue/runtime-core";
import { v4 as uuid4 } from "uuid";
import MultiIcon from "@/components/ui/MultiIcon.vue";

export default defineComponent({
	name: "RadioGroup",
	props: ["options", "modelValue", "disabled"],
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

<style>
@-moz-document url-prefix() {
	.input-radio {
		margin-top: 0 !important;
		margin-bottom: 7.5px !important;
	}
}
</style>
