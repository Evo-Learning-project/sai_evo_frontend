<template>
	<div>
		<!-- <div class="flex items-center space-x-2">
			<span class="text-3xl material-icons-outlined icon-light"> manage_search </span>
			<h3>{{ $t("filter_results.title") }}</h3>
		</div> -->

		<div class="mt-2">
			<!-- <chipset :options="tagsOptions" :modelValue="modelValue.tags"></chipset> -->
			<div class="flex flex-col space-y-4 md:flex-row md:space-y-0 md:space-x-4">
				<!-- <TextInput
					:modelValue="modelValue.label"
					@update:modelValue="emitUpdate('label', $event)"
					class="flex-grow"
					:rightIcon="'search'"
				>
					{{ $t("exercise_editor.exercise_label") }}
				</TextInput> -->
				<TextInput
					:modelValue="modelValue.text"
					@update:modelValue="emitUpdate('text', $event)"
					class="flex-grow"
					:searchBar="true"
					:leftIcon="'search'"
					:placeholder="$t('filter_results.title')"
				>
					<!-- {{ $t("exercise_editor.exercise_text") }} -->
				</TextInput>
				<div class="flex items-center">
					<Btn
						v-if="!full"
						:variant="'icon'"
						:outline="true"
						@click="expanded = !expanded"
						class=""
						id="more-filters-btn"
						><span
							class="
								transition-transform
								duration-200
								ease-out
								transform
								material-icons-outlined
							"
							:class="{ 'rotate-180': expanded }"
						>
							{{ false && expanded ? "expand_less" : "expand_more" }}
						</span>
					</Btn>
					<label v-if="!full" class="cursor-pointer text-muted" for="more-filters-btn">{{
						$t("filter_results.more_filters")
					}}</label>
				</div>
			</div>
			<div
				class="mt-4 duration-200 ease-in-out md:mt-6 transition-max-height"
				:class="{
					'max-h-100 overflow-auto': full || expanded,
					'max-h-0  overflow-y-hidden': !full && !expanded,
				}"
			>
				<Chipset
					v-if="allowFilterByType"
					:allowMultiple="false"
					:options="exerciseTypeOptions"
					:modelValue="modelValue.exercise_types"
					@update:modelValue="emitUpdate('exercise_types', $event)"
				></Chipset>
				<Chipset
					v-if="allowFilterByState"
					class="my-2"
					:allowMultiple="false"
					:options="exerciseStateOptions"
					:modelValue="modelValue.states"
					@update:modelValue="emitUpdate('states', $event)"
				></Chipset>
				<Chipset
					:options="tagsOptions"
					:modelValue="modelValue.tags"
					@update:modelValue="emitUpdate('tags', $event)"
				></Chipset>
			</div>

			<div class="flex items-center w-full">
				<Btn
					v-if="!emptyFilters"
					:variant="'icon'"
					:outline="true"
					@click="$emit('resetFilters')"
					class="mr-0.5"
					id="remove-filters-btn"
					><span class="text-xl material-icons-outlined"> filter_alt_off </span>
				</Btn>
				<label
					v-if="!emptyFilters"
					class="cursor-pointer text-muted"
					for="remove-filters-btn"
					>{{ $t("filter_results.remove_filters") }}</label
				>

				<!-- <Btn
					v-if="!full"
					:variant="'icon'"
					:outline="true"
					@click="expanded = !expanded"
					class="ml-auto mr-0.5"
					id="more-filters-btn"
					><span
						class="
							transition-transform
							duration-200
							ease-out
							transform
							material-icons-outlined
						"
						:class="{ 'rotate-180': expanded }"
					>
						{{ false && expanded ? "expand_less" : "expand_more" }}
					</span>
				</Btn>
				<label v-if="!full" class="cursor-pointer text-muted" for="more-filters-btn">{{
					$t("filter_results.more_filters")
				}}</label> -->
			</div>
		</div>
	</div>
</template>

<script lang="ts">
import { getTranslatedString as _ } from "@/i18n";
import { ExerciseSearchFilter } from "@/api/interfaces";
import Btn from "@/components/ui/Btn.vue";
import Chipset from "@/components/ui/Chipset.vue";
import { ExerciseState, ExerciseType, Tag } from "@/models";
import { defineComponent, PropType } from "@vue/runtime-core";
import { icons as exerciseTypesIcons } from "@/assets/exerciseTypesIcons";
import { icons as exerciseStatesIcons } from "@/assets/exerciseStatesIcons";
import TextInput from "../ui/TextInput.vue";
import { isEmptyFilter } from "@/api/utils";
import { mapStores } from "pinia";
import { useMainStore } from "@/stores/mainStore";
export default defineComponent({
	name: "ExerciseSearchFilters",
	components: {
		Chipset,
		Btn,
		TextInput,
	},
	props: {
		modelValue: {
			type: Object as PropType<ExerciseSearchFilter>,
			required: true,
		},
		full: {
			type: Boolean,
			default: false,
		},
		allowFilterByState: {
			type: Boolean,
			default: true,
		},
		allowFilterByType: {
			type: Boolean,
			default: true,
		},
	},
	data() {
		return {
			expanded: false,
		};
	},
	methods: {
		emitUpdate(key: keyof ExerciseSearchFilter, value: unknown) {
			this.$emit("update:modelValue", {
				...this.modelValue,
				[key]: value,
			});
		},
	},
	computed: {
		...mapStores(useMainStore),
		emptyFilters() {
			return isEmptyFilter(this.modelValue);
		},
		tagsOptions() {
			return this.mainStore.tags.map((t: Tag) => ({
				icons: this.modelValue.tags.includes(t.id as string) ? ["done-sm"] : null,
				value: t.id,
				content: t.name,
			}));
		},
		exerciseTypeOptions() {
			return (Object.keys(ExerciseType) as unknown[] as ExerciseType[])
				.filter((key: string | number) => parseInt(key as string) == key) //(ExerciseType[key] as unknown) == 'number')
				.map(key => ({
					icons: exerciseTypesIcons[key],
					value: key,
					content: _("exercise_types." + key),
				}));
		},
		exerciseStateOptions() {
			return (Object.keys(ExerciseState) as unknown[] as ExerciseState[])
				.filter((key: string | number) => parseInt(key as string) == key) //(ExerciseType[key] as unknown) == 'number')
				.map(key => ({
					icons: exerciseStatesIcons[key],
					value: key,
					content: _("exercise_states." + key),
					description: _("exercise_states_descriptions." + key),
				}));
		},
	},
});
</script>

<style></style>
