<template>
	<div class="relative">
		<label class="absolute top-2 left-1.5 origin-0 fixed-label"><slot></slot></label>

		<div class="w-full">
			<label
				:for="id + '-input-' + index"
				class="
					relative
					flex
					my-0
					max-h-screen
					space-x-0
					cursor-pointer
					items-start
					radio-item
				"
				:class="{ 'radio-container': !disabled }"
				v-for="(option, index) in options"
				:key="id + '-option-' + index"
			>
				<div :id="id + '-radio-' + index" class="mdc-radio">
					<input
						:id="id + '-radio-' + index + '-native'"
						class="mdc-radio__native-control"
						type="radio"
						:name="id"
						:value="option.value"
					/>
					<div class="mdc-radio__background">
						<div class="mdc-radio__outer-circle"></div>
						<div class="mdc-radio__inner-circle"></div>
					</div>
					<div class="mdc-radio__ripple"></div>
				</div>
				<label class="mt-2 cursor-pointer" :for="id + '-radio-' + index + '-native'">
					<p v-html="option.content"
				/></label>
			</label>
		</div>
	</div>
</template>

<script lang="ts">
import { defineComponent } from "@vue/runtime-core";
import { v4 as uuid4 } from "uuid";
import MultiIcon from "@/components/ui/MultiIcon.vue";
import { SelectableOption } from "../../interfaces";

export default defineComponent({
	name: "RadioGroup",
	props: ["options", "modelValue", "disabled"],
	components: {
		//MultiIcon,
	},
	created() {
		this.id = "a" + uuid4();
	},
	mounted() {
		(this.options as SelectableOption[]).map((option, i) => {
			const radio = new (window as any).mdc.radio.MDCRadio(
				document.getElementById(this.id + "-radio-" + i),
			);
			console.log({
				radio,
				checked: radio.checked,
				model: this.modelValue,
				opt: option.value,
			});
			radio.checked = this.modelValue == option.value;
			// attach event listener
			radio.listen("input", e => {
				console.log(e);
				this.$emit("update:modelValue", option.value);
			});
		});
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
			//(inputEvent.target as unknown as { checked: boolean }).checked = false;
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
