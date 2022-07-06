<template>
  <div
    class="sticky mb-auto  top-18 md:self-start shadow-elevation card card-filled"
  >
    <!-- call to action to assess -->
    <div
      v-if="!readOnly && assessment.score === null"
      class="text-sm banner banner-danger"
    >
      <p class="my-auto text-base material-icons-outlined">pending_actions</p>
      <p>
        {{ $t("event_assessment.this_exercise_requires_manual_assessment") }}
      </p>
    </div>

    <!-- read only part -->
    <!-- score -->
    <div class="flex items-center transition-opacity duration-100">
      <p class="text-muted">
        <span class="mr-2"><slot name="scoreTitle"></slot></span>
        <strong class="text-lg">{{ formattedScore ?? "" }}</strong>
        <span v-if="maxScore"
          >&nbsp;{{ $t("misc.out_of") }}
          <strong class="text-lg"> {{ maxScore }}</strong></span
        >
      </p>
      <div v-if="!readOnly" class="flex items-center w-full ml-1">
        <Btn
          :outline="true"
          :variant="'icon'"
          :size="'sm'"
          :tooltip="expanded ? '' : $t('help_texts.edit_score')"
          :disabled="expanded"
          @click="onShowAssessmentControls()"
          ><span class="text-lg icon-light material-icons">edit</span></Btn
        >
        <Btn
          v-if="!readOnly && assessment.score_edited"
          :outline="true"
          class="ml-auto"
          :variant="'icon'"
          :size="'sm'"
          :tooltip="$t('event_assessment.undo_score_edit_tooltip')"
          :disabled="expanded"
          @click="onUndoScoreEdit()"
          ><span class="text-lg icon-light material-icons-outlined"
            >undo</span
          ></Btn
        >
      </div>
    </div>
    <!-- teacher comment -->
    <div class="transition-opacity duration-100">
      <p v-if="(assessment.comment?.length ?? 0) > 0" class="mt-2 text-muted">
        {{
          !readOnly
            ? $t("event_assessment.comment_for_student")
            : $t("misc.teacher_comment")
        }}:
      </p>
      <p v-html="assessment.comment"></p>
    </div>
    <!-- end read-only part -->

    <!-- in-card assessment controls -->
    <div
      :class="{
        'max-h-0': !expanded,
        'max-h-96': expanded,
      }"
      class="flex flex-col overflow-y-hidden duration-200 ease-in-out  transition-max-height"
    >
      <div
        :class="{ 'md:flex-row  md:items-center': !isSubSlot }"
        class="flex flex-col mt-4 ease-in-out"
      >
        <h3>{{ $t("event_assessment.your_assessment") }}</h3>
      </div>

      <!-- actual assessment controls -->
      <div class="mt-4">
        <p>
          <NumberInput class="mb-4" v-model="scoreProxy"
            >{{ $t("event_assessment.assigned_score") }}
          </NumberInput>
          <TextEditor class="w-full" v-model="commentProxy">{{
            $t("event_assessment.comment_for_student")
          }}</TextEditor>
        </p>
      </div>

      <!-- buttons to save or discard changes -->
      <!-- TODO don't display when in modal -->
      <div class="mt-4 ml-auto">
        <Btn
          class="mr-2"
          :outline="false"
          :variant="'primary'"
          :loading="loading"
          :disabled="
            assessment.score === null ||
            String(assessment.score ?? '').length === 0
          "
          @click="onHideAssessmentControls()"
        >
          {{ $t("event_assessment.confirm_assessment") }}
        </Btn>
        <Btn
          :outline="true"
          :disabled="loading"
          :variant="'primary'"
          @click="onHideAssessmentControls(true)"
        >
          {{ $t("dialog.default_cancel_text") }}
        </Btn>
      </div>
    </div>
    <!-- end in-card assessment controls  -->
  </div>
</template>

<script lang="ts">
import { getTranslatedString as _ } from "@/i18n";
import { EventParticipationSlotAssessment } from "@/models";
import { defineComponent, PropType } from "@vue/runtime-core";
import Btn from "../ui/Btn.vue";
import NumberInput from "../ui/NumberInput.vue";
import TextEditor from "../ui/TextEditor.vue";
export default defineComponent({
  name: "ParticipationSlotAssessment",
  emits: {
    toggleExpanded(value: boolean) {
      return true;
    },
    updateAssessment(payload: [keyof EventParticipationSlotAssessment, any]) {
      return true;
    },
    save: null,
  },
  props: {
    assessment: {
      type: Object as PropType<EventParticipationSlotAssessment>,
      required: true,
    },
    readOnly: {
      type: Boolean,
      required: true,
    },
    maxScore: {
      type: Number,
    },
    expanded: {
      type: Boolean,
      default: false,
    },
    loading: {
      type: Boolean,
      default: false,
    },
    isSubSlot: {
      type: Boolean,
      default: false,
    },
  },
  methods: {
    onShowAssessmentControls() {
      this.$emit("toggleExpanded", true);
    },
    onHideAssessmentControls(discard = false) {
      this.$emit("toggleExpanded", false);
      if (!discard) {
        this.$emit("save");
      }
    },
    onUndoScoreEdit() {
      if (confirm(_("event_assessment.undo_score_edit"))) {
        this.$emit("updateAssessment", ["score", null]);
        this.onHideAssessmentControls();
      }
    },
  },
  computed: {
    formattedScore(): number | null {
      if (
        typeof this.assessment.score === "undefined" ||
        this.assessment.score === null
      ) {
        return null;
      }
      const scoreStr = String(this.assessment.score);
      return Number.isInteger(parseFloat(scoreStr))
        ? parseInt(scoreStr)
        : this.assessment.score;
    },
    scoreProxy: {
      get() {
        return this.assessment.score ?? 0;
      },
      set(val: any) {
        this.$emit("updateAssessment", ["score", val]);
      },
    },
    commentProxy: {
      get() {
        return this.assessment.comment ?? "";
      },
      set(val: string) {
        this.$emit("updateAssessment", ["comment", val]);
      },
    },
  },
  components: { Btn, NumberInput, TextEditor },
});
</script>

<style></style>
