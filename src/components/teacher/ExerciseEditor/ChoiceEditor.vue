<template>
  <div
    class="flex flex-col py-3 my-3 space-y-4  md:space-x-4 md:space-y-0 md:flex-row"
  >
    <div class="flex items-center">
      <span
        class="mr-auto text-lg cursor-move  md:mr-2 drag-handle material-icons-outlined opacity-70"
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
        ><span class="text-base text-danger-dark material-icons-outlined">
          close
        </span></Btn
      >
    </div>
    <TextEditor
      v-if="!singleLine"
      class="w-full md:w-8/12"
      :modelValue="modelValue.text"
      @update:modelValue="onUpdate('text', $event)"
      >{{ $t("exercise_editor.choice_text") }}</TextEditor
    >
    <TextInput
      v-else
      class="w-full md:w-9/12"
      :modelValue="modelValue.text"
      @update:modelValue="onUpdate('text', $event)"
      >{{ $t("exercise_editor.choice_text") }}</TextInput
    >

    <div class="flex flex-grow space-x-2">
      <div>
        <NumberInput
          class="mb-auto"
          :modelValue="modelValue.score_selected"
          @update:modelValue="onUpdate('score_selected', $event)"
          :leftIcon="
            iconType === 'radio' ? 'radio_button_checked' : 'check_box'
          "
          >{{ $t("exercise_editor.choice_score_checked") }}</NumberInput
        >
        <Tooltip
          class="-ml-1.5"
          :textCode="'exercise_editor.score_if_checked'"
        ></Tooltip>
      </div>
      <div>
        <NumberInput
          class="mb-auto"
          :modelValue="modelValue.score_unselected"
          :leftIcon="
            iconType === 'radio'
              ? 'radio_button_unchecked'
              : 'check_box_outline_blank'
          "
          @update:modelValue="onUpdate('score_unselected', $event)"
          >{{ $t("exercise_editor.choice_score_unchecked") }}</NumberInput
        >
        <Tooltip
          class="-ml-1.5"
          :textCode="'exercise_editor.score_if_unchecked'"
        ></Tooltip>
      </div>
    </div>
    <div class="my-auto">
      <Btn
        class="
          hidden
          -ml-3.5
          transition-opacity
          duration-100
          opacity-50
          md:mr-1 md:-ml-3 md:block
          hover:opacity-100
        "
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
import { defineComponent, PropType } from "@vue/runtime-core";
import TextEditor from "@/components/ui/TextEditor.vue";
import NumberInput from "@/components/ui/NumberInput.vue";
import Tooltip from "@/components/ui/Tooltip.vue";
import TextInput from "@/components/ui/TextInput.vue";
import Btn from "@/components/ui/Btn.vue";

export default defineComponent({
  name: "ChoiceEditor",
  props: {
    modelValue: {
      type: Object as PropType<ExerciseChoice>,
      required: true,
    },
    iconType: {
      type: String as PropType<"checkbox" | "radio">,
      required: true,
    },
    singleLine: {
      type: Boolean,
      default: false,
    },
  },
  components: {
    TextEditor,
    NumberInput,
    Tooltip,
    TextInput,
    Btn,
  },
  methods: {
    onUpdate(field: keyof ExerciseChoice, value: unknown) {
      console.log("choice update", field, value);
      this.$emit("choiceUpdate", { field, value });
    },
  },
});
</script>

<style></style>
