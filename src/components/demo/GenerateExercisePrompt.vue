<template>
	<div class="bg-light card flex flex-col">
		<div class="flex items-center space-x-2 mb-4">
			<span class="text-primary material-icons-outlined"> bolt </span>
			<h3 class="mb-0">Genera esercizi</h3>
		</div>
		<p class="mb-4 text-muted">
			Descrivi gli esercizi che vuoi generare. Includi dettagli come argomento, difficoltà
			e tipologia di esercizio.
		</p>
		<div class="mb-4 flex items-center">
			<p class="text-muted">Facile</p>
			<div class="w-1/3">
				<div class="mdc-slider mdc-slider--discrete mdc-slider--tick-marks">
					<input
						class="mdc-slider__input"
						type="range"
						min="1"
						max="5"
						value="3"
						name="volume"
						step="1"
						aria-label="Discrete slider with tick marks demo"
					/>
					<div class="mdc-slider__track w-1/2">
						<div class="mdc-slider__track--inactive"></div>
						<div class="mdc-slider__track--active">
							<div class="mdc-slider__track--active_fill"></div>
						</div>
						<div class="mdc-slider__tick-marks">
							<div class="mdc-slider__tick-mark--active"></div>
							<div class="mdc-slider__tick-mark--active"></div>
							<div class="mdc-slider__tick-mark--active"></div>
							<div class="mdc-slider__tick-mark--active"></div>
							<div class="mdc-slider__tick-mark--active"></div>
							<!-- <div class="mdc-slider__tick-mark--active"></div>
							<div class="mdc-slider__tick-mark--inactive"></div>
							<div class="mdc-slider__tick-mark--inactive"></div>
							<div class="mdc-slider__tick-mark--inactive"></div>
							<div class="mdc-slider__tick-mark--inactive"></div>
							<div class="mdc-slider__tick-mark--inactive"></div> -->
						</div>
					</div>
					<div class="mdc-slider__thumb">
						<div class="mdc-slider__value-indicator-container" aria-hidden="true">
							<div class="mdc-slider__value-indicator hidden">
								<span class="mdc-slider__value-indicator-text"> Media difficoltà </span>
							</div>
						</div>
						<div class="mdc-slider__thumb-knob"></div>
					</div>
				</div>
			</div>
			<p class="text-muted">Difficile</p>
			<Dropdown class="ml-auto" :options="exerciseTypeOptions" v-model="exerciseType">
				{{ $t("exercise_editor.exercise_type") }}
			</Dropdown>
		</div>
		<div>
			<TextEditor :force-base-editor="true" v-model="prompt" />
		</div>
		<div class="flex items-center mt-4">
			<p>Genera</p>
			<NumberInput v-model="amount" class="w-16 mx-2" />
			<p>
				{{ amount === 1 ? "esercizio" : "esercizi" }}
			</p>
			<Btn
				:variant="'primary'"
				:size="'sm'"
				:outline="false"
				class="ml-2"
				@click="$emit('confirm')"
			>
				<!-- <span class="material-icons-outlined">bolt</span> -->
				Genera
			</Btn>
		</div>
	</div>
</template>

<script lang="ts">
import { defineComponent, PropType } from "@vue/runtime-core";
import TextEditor from "../ui/TextEditor.vue";
import Dropdown from "../ui/Dropdown.vue";
import { exerciseTypeOptions } from "../../const";
import { ExerciseType } from "../../models";
import { debounce } from "lodash";
import NumberInput from "../ui/NumberInput.vue";
import Btn from "../ui/Btn.vue";
export default defineComponent({
	name: "GenerateExercisePrompt",
	props: {},
	watch: {
		// when the prompt changes, debounce a call to predictExerciseType
		prompt() {
			this.debounceCall(this.predictExerciseType, 500);
		},
	},
	mounted() {
		const slider = new (window as any).mdc.slider.MDCSlider(
			document.querySelector(".mdc-slider"),
		);
		// slider.setValue(3);
	},
	data() {
		return {
			prompt: "",
			exerciseType: ExerciseType.MULTIPLE_CHOICE_SINGLE_POSSIBLE,
			debounceHandle: null as number | null,
			amount: 1,
		};
	},
	methods: {
		predictExerciseType() {
			if (this.prompt.toLowerCase().includes("javascript")) {
				this.exerciseType = ExerciseType.JS;
			} else {
				this.exerciseType = ExerciseType.MULTIPLE_CHOICE_SINGLE_POSSIBLE;
			}
		},
		debounceCall(fn, time) {
			clearTimeout(this.debounceHandle as number);
			this.debounceHandle = setTimeout(fn, time);
		},
	},
	computed: {
		exerciseTypeOptions() {
			return exerciseTypeOptions;
			// .filter(
			// 	o => !this.subExercise || o.value !== ExerciseType.AGGREGATED,
			// );
		},
	},
	components: { TextEditor, Dropdown, NumberInput, Btn },
});
</script>

<style></style>
