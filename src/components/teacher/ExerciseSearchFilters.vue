<template>
  <div>
    <div class="flex items-center space-x-2">
      <span class="material-icons-outlined text-3xl opacity-60"> manage_search </span>
      <h3>{{ $t("filter_results.title") }}</h3>
    </div>

    <div class="mt-5">
      <!-- <chipset :options="tagsOptions" :modelValue="modelValue.tags"></chipset> -->
      <div class="flex flex-col space-y-4 md:flex-row md:space-y-0 md:space-x-4">
        <TextInput
          :modelValue="modelValue.label"
          @update:modelValue="emitUpdate('label', $event)"
          class="flex-grow"
          :rightIcon="'search'"
        >
          {{ $t("exercise_editor.exercise_label") }}
        </TextInput>
        <TextInput
          :modelValue="modelValue.text"
          @update:modelValue="emitUpdate('text', $event)"
          class="flex-grow"
          :rightIcon="'search'"
        >
          {{ $t("exercise_editor.exercise_text") }}
        </TextInput>
      </div>
      <div
        class="md:mt-6 mt-4 overflow-y-hidden transition-max-height duration-200 ease-in-out"
        :class="{ 'max-h-96': full || expanded, 'max-h-0': !full & !expanded }"
      >
        <Chipset
          :options="exerciseTypeOptions"
          :modelValue="modelValue.exercise_types"
          @update:modelValue="onExerciseTypeUpdate($event)"
        ></Chipset>
        <Chipset
          :options="exerciseStateOptions"
          :modelValue="modelValue.states"
          @update:modelValue="onExerciseTypeUpdate($event)"
        ></Chipset>
      </div>
      <!-- <tag-input
            class="md:mt-1"
            :modelValue="modelValue.tags"
            :placeholder="$t('filter_results.filter_by_tag')"
          ></tag-input> -->
      <div class="flex items-center w-full">
        <!-- <btn @click="applyFilters()" class="mt-4 ml-auto">{{
          $t('filter_results.title')
        }}</btn> -->
        <Btn
          v-if="!full"
          :variant="'icon'"
          :outline="true"
          @click="expanded = !expanded"
          class="ml-auto mr-0.5"
          id="more-filters-btn"
          ><span
            class="material-icons-outlined transform transition-transform duration-200 ease-out"
            :class="{ 'rotate-180': expanded }"
          >
            {{ false && expanded ? "expand_less" : "expand_more" }}
          </span>
        </Btn>
        <label for="more-filters-btn">{{ $t("filter_results.more_filters") }}</label>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { getTranslatedString as _ } from "@/i18n";
// import { icons as exerciseTypesIcons } from '@/assets/exerciseTypesIcons'
// import { icons as exerciseStatesIcons } from '@/assets/exerciseStatesIcons'
// import {
//   Exercise,
//   ExerciseState,
//   ExerciseType,
//   getBlankExercise,
//   Tag
// } from '@/models'
import { ExerciseSearchFilter } from "@/api/interfaces";
import Btn from "@/components/ui/Btn.vue";
import Chipset from "@/components/ui/Chipset.vue";
import { ExerciseState, ExerciseType, Tag } from "@/models";
import { defineComponent, PropType } from "@vue/runtime-core";
import { icons as exerciseTypesIcons } from "@/assets/exerciseTypesIcons";
import { icons as exerciseStatesIcons } from "@/assets/exerciseStatesIcons";
import TextInput from "../ui/TextInput.vue";
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
  },
  data() {
    return {
      expanded: false,
    };
  },
  methods: {
    onExerciseTypeUpdate(val: unknown) {
      alert("Questa funzionalità non è ancora disponibile");
    },
    emitUpdate(key: keyof ExerciseSearchFilter, value: unknown) {
      this.$emit("update:modelValue", {
        ...this.modelValue,
        [key]: value,
      });
    },
  },
  computed: {
    tags(): Tag[] {
      return [{ name: "tag1" }, { name: "tag2" }, { name: "tag3" }];
    },
    // tagsOptions () {
    //   return this.tags.map(t => ({
    //     value: t.name,
    //     content: t.name
    //   }))
    // },
    exerciseTypeOptions() {
      return ((Object.keys(ExerciseType) as unknown[]) as ExerciseType[])
        .filter((key: string | number) => parseInt(key as string) == key) //(ExerciseType[key] as unknown) == 'number')
        .map((key) => ({
          icons: exerciseTypesIcons[key],
          value: key,
          content: _("exercise_types." + key),
        }));
    },
    exerciseStateOptions() {
      return ((Object.keys(ExerciseState) as unknown[]) as ExerciseState[])
        .filter((key: string | number) => parseInt(key as string) == key) //(ExerciseType[key] as unknown) == 'number')
        .map((key) => ({
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
