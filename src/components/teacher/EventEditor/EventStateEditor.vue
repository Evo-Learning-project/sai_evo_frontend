<template>
  <div class="">
    <h3 class="mb-3">{{ $t("event_editor.state_editor_title") }}</h3>
    <div class="my-4 banner banner-light" v-if="isDraft">
      <span class="ml-px text-yellow-900 material-icons-outlined">
        error_outline
      </span>
      <p class="">{{ currentEventStateDescription }}</p>
    </div>
    <div class="my-4 banner banner-success" v-if="isPlanned">
      <span class="ml-px text-success material-icons-outlined">
        check_circle_outline
      </span>
      <p class="">{{ currentEventStateDescription }}</p>
    </div>
    <div class="">
      <div v-if="validationErrors.length > 0" class="mb-12">
        <p>{{ $t("event_editor.correct_errors_to_publish") }}</p>
        <ul class="list-disc list-inside">
          <li
            class="text-muted text-danger-dark"
            v-for="(error, index) in validationErrors"
            :key="'err-' + index"
          >
            {{ error }}
          </li>
        </ul>
      </div>
      <div
        class="flex flex-col mt-2 space-y-2  md:items-center md:flex-row md:space-y-0 md:space-x-4"
      >
        <h5 class="">
          {{
            isDraft || isPlanned
              ? $t("event_editor.current_state_is")
              : $t("event_editor.state_is")
          }}
          <strong>{{ currentEventStateName }}</strong
          >.
        </h5>
        <Btn
          class=""
          v-if="isDraft || isPlanned"
          :variant="'primary'"
          :disabled="isDraft && validationErrors.length > 0"
          :loading="localLoading"
          @click="isDraft ? publish() : revertToDraft()"
        >
          {{
            isDraft
              ? $t("event_editor.publish")
              : $t("event_editor.revert_to_draft")
          }}
        </Btn>
      </div>
      <p v-if="isPlanned" class="mt-10 text-muted">
        {{ $t("event_editor.event_planned_help_text") }}
        <!-- <strong>{{ formattedTimestamp }}</strong> -->
        <strong
          >&nbsp;<Timestamp
            :value="modelValue.begin_timestamp"
          ></Timestamp></strong
        >.
      </p>
      <div
        class="flex flex-col items-stretch mt-2 space-y-2"
        v-if="isPlanned || isOpen"
      >
        <p class="text-muted">
          {{ $t("event_editor.this_is_the_link_to_the_event") }}
        </p>
        <CopyToClipboard :value="permalink"></CopyToClipboard>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Event, EventState, getExamValidationErrors } from "@/models";
import { defineComponent, PropType } from "@vue/runtime-core";
import { icons as eventStateIcons } from "@/assets/eventStateIcons";
import { getTranslatedString as _ } from "@/i18n";
//import Card from "@/components/ui/Card.vue";
import Btn from "@/components/ui/Btn.vue";
import { getFormattedTimestamp } from "@/utils";
import Timestamp from "@/components/ui/Timestamp.vue";
import CopyToClipboard from "@/components/ui/CopyToClipboard.vue";
import { loadingMixin } from "@/mixins";
//import Dropdown from '@/components/ui/Dropdown.vue'

export default defineComponent({
  components: {
    // Card,
    Btn,
    Timestamp,
    CopyToClipboard,
  },
  mixins: [loadingMixin],
  props: {
    modelValue: {
      type: Object as PropType<Event>,
      required: true,
    },
  },
  name: "EventStateEditor",
  methods: {
    emitUpdate(value: EventState) {
      this.$emit("update:modelValue", value);
    },
    publish() {
      this.emitUpdate(EventState.PLANNED);
    },
    revertToDraft() {
      this.emitUpdate(EventState.DRAFT);
    },
  },
  computed: {
    eventStateOptions() {
      return (Object.keys(EventState) as unknown[] as EventState[])
        .filter((key: string | number) => parseInt(key as string) == key) //(ExerciseType[key] as unknown) == 'number')
        .map((key) => ({
          icons: eventStateIcons[key],
          value: key,
          content: _("event_states." + key),
          description: _("event_states_descriptions." + key),
        }));
    },
    isDraft() {
      return this.modelValue.state == EventState.DRAFT;
    },
    isPlanned() {
      return this.modelValue.state == EventState.PLANNED;
    },
    isOpen() {
      return this.modelValue.state == EventState.OPEN;
    },
    currentEventStateName() {
      return this.eventStateOptions[
        this.modelValue?.state
      ]?.content?.toLowerCase();
    },
    currentEventStateDescription() {
      return this.eventStateOptions[this.modelValue?.state]?.description;
    },
    formattedTimestamp() {
      return getFormattedTimestamp(this.modelValue.begin_timestamp ?? "");
    },
    validationErrors() {
      if (!this.modelValue) {
        return [];
      }
      return getExamValidationErrors(this.modelValue).map((e) =>
        _("exam_validation_errors." + e)
      );
    },
    permalink(): string {
      return (
        window.location.origin +
        this.$router.resolve({
          name: "ExamParticipationPreview",
          params: { examId: this.modelValue.id },
        }).fullPath
      );
    },
  },
});
</script>

<style></style>
