<template>
	<div class="flex flex-col py-3 my-3 space-y-4 md:space-x-4 md:space-y-0 md:flex-row">
		<div class="flex items-center">
			<span
				class="mr-auto text-lg cursor-move md:mr-2 drag-handle material-icons-outlined opacity-70"
				:class="{ 'my-auto': !singleLine, 'mt-1': singleLine }"
			>
				drag_indicator
			</span>
			<Btn
				class="ml-auto md:hidden"
				:outline="true"
				:variant="'icon'"
				:tooltip="$t('exercise_editor.delete_choice')"
				@click="$emit('delete')"
				><span class="text-base text-danger-dark material-icons-outlined"> close </span></Btn
			>
		</div>
		<TextEditor
			v-if="!singleLine"
			class="w-full md:w-10/12"
			:modelValue="modelValue.text"
			@update:modelValue="onUpdate('text', $event)"
			>{{ $t("exercise_editor.choice_text") }}
			<template v-if="v$.choice.text.$errors.length > 0" v-slot:errors>
				<div class="input-errors" v-for="error of v$.choice.text.$errors" :key="error.$uid">
					<div class="error-msg">
						{{ $t("validation_errors.exercise.choice." + error.$uid) }}
					</div>
				</div>
			</template></TextEditor
		>
		<TextInput
			v-else
			class="w-full md:w-10/12"
			:modelValue="modelValue.text"
			@update:modelValue="onUpdate('text', $event)"
			>{{ $t("exercise_editor.choice_text") }}
			<template v-if="v$.choice.text.$errors.length > 0" v-slot:errors>
				<div class="input-errors" v-for="error of v$.choice.text.$errors" :key="error.$uid">
					<div class="error-msg">
						{{ $t("validation_errors.exercise.choice." + error.$uid) }}
					</div>
				</div>
			</template></TextInput
		>

		<div class="md:w-2/12">
			<NumberInput
				class="mb-auto"
				:iconFilled="true"
				:max="100"
				:min="-100"
				:modelValue="modelValue.correctness"
				@update:modelValue="onUpdate('correctness', $event)"
				:leftIcon="
					iconType === 'radio' ? 'radio_button_checked' : iconType === 'dropdown' ? 'expand_circle_down' : 'check_box'
				"
			>
				<div class="flex w-full items-center space-x-0.5">
					<p>{{ $t("exercise_editor.choice_correctness") }}</p>
					<!-- <Tooltip
            :placement="'left'"
            class="-ml-1.5 -mb-1.25px transform scale-125"
            :textCode="'exercise_editor.score_if_checked'"
          ></Tooltip> -->
				</div>
				<!-- highlight in red if there's a score-related error -->
				<template #errors v-if="invalidCorrectness"> &nbsp; </template>
			</NumberInput>
		</div>
		<div class="my-auto">
			<Btn
				class="hidden -ml-3.5 transition-opacity duration-100 opacity-50 md:mr-1 md:-ml-3 md:block hover:opacity-100"
				:outline="true"
				:variant="'icon'"
				:tooltip="$t('exercise_editor.delete_choice')"
				@click="$emit('delete')"
				><span class="text-base material-icons"> delete </span></Btn
			>
		</div>
	</div>
</template>

<script lang="ts">
import { ExerciseChoice } from "@/models";
import { defineComponent, PropType, inject } from "@vue/runtime-core";
import TextEditor from "@/components/ui/TextEditor.vue";
import NumberInput from "@/components/ui/NumberInput.vue";
import Tooltip from "@/components/ui/Tooltip.vue";
import TextInput from "@/components/ui/TextInput.vue";
import Btn from "@/components/ui/Btn.vue";
import useVuelidate from "@vuelidate/core";
import { exerciseChoiceValidation } from "@/validation/models";

export default defineComponent({
	name: "ChoiceEditor",
	props: {
		modelValue: {
			type: Object as PropType<ExerciseChoice>,
			required: true,
		},
		iconType: {
			type: String as PropType<"checkbox" | "radio" | "dropdown">,
			required: true,
		},
		singleLine: {
			type: Boolean,
			default: false,
		},
		invalidCorrectness: {
			type: Boolean,
			default: false,
		},
	},
	validations() {
		return {
			choice: exerciseChoiceValidation,
		};
	},
	setup() {
		const v = useVuelidate();
		// provide("v$", v);
		return { v$: v };
	},
	components: {
		TextEditor,
		NumberInput,
		//Tooltip,
		TextInput,
		Btn,
	},
	methods: {
		onUpdate(field: keyof ExerciseChoice, value: unknown) {
			console.log("choice update", field, value);
			this.$emit("choiceUpdate", { field, value });
		},
	},
	computed: {
		choice() {
			return this.modelValue;
		},
	},
});
</script>

<style></style>
