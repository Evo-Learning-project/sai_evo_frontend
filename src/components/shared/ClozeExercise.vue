<template>
  <div class="items-center user-content">
    <span
      v-for="(unit, index) in clozeUnits"
      :key="exercise.id + '-unit-' + index"
      class=""
    >
      <span v-html="unit.text" class=""></span>
      <select
        class="inline material-select"
        v-if="slot.sub_slots[index]"
        :value="slot.sub_slots[index].selected_choices[0] ?? ''"
        @change="onSelectionUpdate(slot.sub_slots[index], $event.target.value)"
      >
        <option value="">{{ $t("misc.select_one") }}</option>

        <option
          v-for="choice in unit.choices"
          :key="exercise.id + '-unit-' + index + '-choice-' + choice.id"
          :value="choice.id"
        >
          {{ choice.text }}
        </option>
      </select>
    </span>
  </div>
</template>

<script lang="ts">
const CLOZE_SEPARATOR = "[[?]]";
import { EventParticipationSlot, Exercise, ExerciseChoice } from "@/models";
import { defineComponent, PropType } from "@vue/runtime-core";
export default defineComponent({
  name: "ClozeExercise",
  props: {
    slot: {
      type: Object as PropType<EventParticipationSlot>,
      required: true,
    },
  },
  methods: {
    onSelectionUpdate(slot: EventParticipationSlot, selection: string) {
      console.log("slot", slot.id, "selection", selection);
      this.$emit("updateSelectedChoices", {
        slot: slot,
        payload: selection.length === 0 ? [] : [selection],
      });
    },
    transformUnitText(text: string): string {
      // adjusts <p> tags and inlining to try and preserve same-line relationships
      // between pieces of exercise text and select elements

      if (!text.endsWith("</p>")) {
        const tags = text.matchAll(/<[^>]*>/g) ?? [];
        const tagsArr = [...tags];
        console.log("::", tagsArr);
        console.log("----", tagsArr[tagsArr.length - 1]?.[0]);
        // if (text.startsWith("<p>")) {
        //   return "<p style='display: inline'>" + text.slice(3) + "</p>";
        // }
        if (tagsArr[tagsArr.length - 1]?.[0] === "<p>") {
          console.log(
            "from",
            text,
            "to",
            text.slice(0, tagsArr[tagsArr.length - 1].index) +
              "<p style='display: inline'>" +
              text.slice((tagsArr[tagsArr.length - 1].index as number) + 3) +
              "</p>"
          );
          return (
            text.slice(0, tagsArr[tagsArr.length - 1].index) +
            "<p style='display: inline'>" +
            text.slice((tagsArr[tagsArr.length - 1].index as number) + 3) +
            "</p>"
          );
        }
      }

      return text;
    },
  },
  computed: {
    exercise(): Exercise {
      return this.slot.exercise;
    },
    clozeUnits(): { text: string; choices: ExerciseChoice[] }[] {
      const tokens = this.exercise.text.split(CLOZE_SEPARATOR);

      console.log("TOKENS", tokens);

      return tokens.map((t, i) => ({
        subSlot: this.slot.sub_slots[i],
        text: this.transformUnitText(t),
        choices: (this.exercise.sub_exercises as Exercise[])[i]
          ?.choices as ExerciseChoice[],
      }));
    },
  },
});
</script>

<style></style>
