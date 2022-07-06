<template>
  <AbstractExercise v-bind="$slots">
    <template #submissionControls>
      <FileUpload
        v-model="attachmentProxy"
        @download="onDownloadAttachment"
      ></FileUpload>
    </template>
  </AbstractExercise>
</template>

<script lang="ts">
import { defineComponent, PropType } from "@vue/runtime-core";
import AbstractExercise from "./AbstractExercise.vue";
import FileUpload from "@/components/ui/FileUpload.vue";
import {
  Exercise,
  EventParticipationSlotSubmission,
  getEmptySubmission,
} from "@/models";
import { exerciseProps } from "./shared";
export default defineComponent({
  name: "AttachmentExercise",
  props: {
    ...exerciseProps,
  },
  methods: {
    onDownloadAttachment() {
      // TODO implement
    },
  },
  computed: {
    attachmentProxy: {
      get() {
        return this.submission.attachment
          ? [{ ...this.submission.attachment }]
          : [];
      },
      set(val: any) {
        this.$emit("updateSubmission", ["attachment", val]);
      },
    },
  },
  components: { AbstractExercise, FileUpload },
});
</script>

<style></style>
