<template>
  <AbstractExercise v-bind="$props">
    <template #submissionControls>
      <TextEditor
        :disabled="readOnly"
        v-model="answerTextProxy"
        @blur="$emit('blur')"
      >
        {{ $t("event_participation_slot.text_answer_label") }}
      </TextEditor>
    </template>
    <template #readOnlyAnswer>
      <div class="w-full whitespace-pre" style="margin-top: -21px">
        <p class="ml-2 text-sm text-muted">
          {{ $t("event_assessment.text_answer_label") }}
        </p>
        <ProcessedTextFragment
          style="white-space: break-spaces"
          class="w-full px-4 py-2 rounded bg-gray-50"
          :value="answerTextProxy"
          :defaultValue="$t('misc.no_answer')"
        ></ProcessedTextFragment>
      </div>
    </template>
  </AbstractExercise>
</template>

<script lang="ts">
import { defineComponent, PropType } from "@vue/runtime-core";
import TextEditor from "@/components/ui/TextEditor.vue";
import {
  Exercise,
  EventParticipationSlot,
  getFakeEventParticipationSlot,
} from "@/models";
export default defineComponent({
  name: "OpenAnswerExercise",
  props: {
    exercise: {
      type: Object as PropType<Exercise>,
      required: true,
    },
    slot: {
      type: Object as PropType<EventParticipationSlot>,
      default: getFakeEventParticipationSlot,
    },
    readOnly: {
      type: Boolean,
      default: false,
    },
  },
  methods: {},
  computed: {
    answerTextProxy: {
      get() {
        return this.slot.answer_text;
      },
      set(val: string) {
        this.$emit("updateAnswerText", val);
      },
    },
  },
  components: { TextEditor },
});
</script>

<style></style>
