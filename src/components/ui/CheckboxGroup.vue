<template>
	<div>
		<label
			:class="[
				disabled ? '' : 'checkbox-container',
				'relative  flex space-x-1.5 items-start ',
				optionClass,
				itemClass,
			]"
			v-for="(option, index) in options"
			:key="id + '-checkbox-' + index"
			class="checkbox-item"
		>
			<div class="mdc-form-field">
				<div :id="id + '-checkbox-' + index" class="mdc-checkbox">
					<input
						:id="id + '-checkbox-' + index + '-native'"
						type="checkbox"
						class="mdc-checkbox__native-control"
						:name="id"
					/>
					<div class="mdc-checkbox__background">
						<svg class="mdc-checkbox__checkmark" viewBox="0 0 24 24">
							<path
								class="mdc-checkbox__checkmark-path"
								fill="none"
								d="M1.73,12.91 8.1,19.28 22.79,4.59"
							/>
						</svg>
						<div class="mdc-checkbox__mixedmark"></div>
					</div>
					<div class="mdc-checkbox__ripple"></div>
				</div>
				<label :for="id + '-checkbox-' + index + '-native'">
					<div v-html="option.content" />
				</label>
			</div>
		</label>
	</div>
</template>

<script lang="ts">
import { SelectableOption } from "@/interfaces";
import { defineComponent, PropType } from "@vue/runtime-core";
import { v4 as uuid4 } from "uuid";

export default defineComponent({
	name: "CheckboxGroup",
	//props: ['options', 'modelValue', 'disabled'],
	props: {
		options: {
			type: Object as PropType<SelectableOption[]>,
			required: true,
		},
		modelValue: {
			type: Array as PropType<unknown[]>,
			required: true,
		},
		disabled: {
			type: Boolean,
			default: false,
		},
		labelClass: {
			type: String,
			default: "",
		},
		optionClass: {
			type: String,
			default: "",
		},
		useToggles: {
			type: Boolean,
			default: false,
		},
		usesCustomSlot: {
			type: Boolean,
			default: false,
		},
		itemClass: {
			type: String,
			default: "",
		},
	},
	// when disabled changes, update the checkboxes
	watch: {
		disabled: {
			handler() {
				this.$nextTick(() => {
					this.checkboxes.forEach(checkbox => {
						checkbox.disabled = this.disabled;
					});
				});
			},
			immediate: true,
		},
	},
	mounted() {
		(this.options as SelectableOption[]).map((option, i) => {
			const checkbox = new (window as any).mdc.checkbox.MDCCheckbox(
				document.getElementById(this.id + "-checkbox-" + i),
			);
			this.checkboxes.push(checkbox);

			checkbox.checked = this.modelValue.includes(option.value);
			checkbox.disabled = this.disabled;

			// attach event listener
			checkbox.listen("input", e => {
				console.log(e);
				this.$emit(
					"update:modelValue",
					e.target.checked
						? [...this.modelValue, option.value]
						: this.modelValue.filter(v => v !== option.value),
				);
			});
		});
	},
	data() {
		return {
			id: "a" + uuid4(),
			checkboxes: [] as any[],
		};
	},
	methods: {
		onToggleUpdate(event: unknown, option: SelectableOption) {
			if (event) {
				// new selection
				this.proxyModelValue = [...this.proxyModelValue, option.value];
			} else {
				// deselection
				this.proxyModelValue = this.proxyModelValue.filter(v => v !== option.value);
			}
		},
	},
	computed: {
		proxyModelValue: {
			get(): unknown[] {
				return this.modelValue;
			},
			set(val: SelectableOption[]) {
				this.$emit("update:modelValue", val);
			},
		},
	},
});
</script>

<style></style>
