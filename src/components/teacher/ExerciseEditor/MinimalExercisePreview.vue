<template>
  <div>
    <div v-if="reduced" class="flex items-center space-x-0.5">
      <p class="font-medium">{{ previewTitle }}</p>
      <Btn
        v-if="previewable"
        :variant="'icon'"
        :outline="true"
        :tooltip="$t('misc.preview')"
        @click="showPreview = true"
        ><span
          style="font-size: 25px !important"
          class="material-icons-outlined -mb-0.5"
        >
          fullscreen
        </span>
      </Btn>
    </div>
    <div
      v-else
      class="flex flex-col h-full card card-border"
      :class="{
        'card-hoverable hover:border-transparent hover-shadow-elevation':
          hoverable,
        'outline-success outline-4 border-transparent': highlighted,
        'bg-gray-50 opacity-60': selectionDisabled,
      }"
    >
      <div class="relative">
        <div class="flex items-center mb-3">
          <h4
            class="mr-2"
            :class="{
              'text-muted font-semibold': exercise.label?.length === 0,
            }"
          >
            {{ previewTitle }}
          </h4>
          <Tooltip
            :noArrow="true"
            :placement="'bottom'"
            :textValue="$t('exercise_states.' + exercise.state)"
          >
            <div class="my-auto cursor-default chip">
              <div class="flex items-center">
                <MultiIcon
                  class="w-6 -ml-0.5 -mr-1.25px"
                  :icons="exerciseStateIcons"
                ></MultiIcon>
              </div></div
          ></Tooltip>
          <Tooltip
            :noArrow="true"
            :placement="'bottom'"
            :textValue="$t('exercise_types.' + exercise.exercise_type)"
          >
            <div class="my-auto cursor-default chip">
              <div class="flex items-center">
                <MultiIcon
                  class="w-6 -ml-0.5 -mr-1.25px"
                  :class="{
                    '-ml-1.5 mr-1 mt-0.5':
                      exercise.exercise_type === ExerciseType.JS,
                  }"
                  :icons="exerciseTypeIcons"
                ></MultiIcon>
              </div></div
          ></Tooltip>
        </div>
        <!-- <div class="overflow-hidden" :style="tagsDivStyle"> -->
        <FadedEdgesScrollableFragment
          class="flex mb-2"
          :id="tagsDivId"
          :style="tagsDivStyle"
        >
          <Tag
            class="mr-1"
            :class="{ 'z-10': index === tags.length - 1 }"
            v-for="(tag, index) in tags"
            :key="elementId + '-tag-' + index"
            :tag="tag"
            :small="true"
          ></Tag>
        </FadedEdgesScrollableFragment>
        <!-- </div> -->
      </div>
      <div class="relative overflow-y-hidden h-14">
        <div
          style="
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
            overflow: hidden;
          "
          class="w-11/12 overflow-x-hidden overflow-ellipsis text-muted"
          v-html="previewText"
        ></div>
      </div>
      <div class="flex items-center mt-auto ml-auto">
        <Btn
          @click="$emit('edit')"
          :variant="'icon'"
          :outline="true"
          class="icon-btn-primary"
          v-if="showEdit"
          :tooltip="$t('misc.edit')"
        >
          <span class="text-xl material-icons"> edit </span>
          <!-- {{ $t("event_preview.editor") }} -->
        </Btn>
        <Btn
          class="ml-auto"
          v-if="previewable"
          :variant="'icon'"
          :outline="true"
          :tooltip="$t('misc.preview')"
          @click="showPreview = true"
          ><span
            style="font-size: 25px !important"
            class="material-icons-outlined -mb-0.5"
          >
            fullscreen
          </span>
        </Btn>

        <!-- <Btn
          class="ml-auto"
          v-if="previewable"
          :variant="'icon'"
          :outline="true"
          :tooltip="$t('misc.preview')"
          @click="showPreview = true"
        >
          <svg
            style="width: 22px; height: 22px"
            class="-mb-0.5"
            viewBox="0 0 24 24"
          >
            <path
              fill="currentColor"
              d="M17 9H16.5 17M7 15H10C10.08 14.32 10.23 13.64 10.5 13H7V15M11.9 10.9C13.17 9.64 14.84 9 16.5 9H7V11H11.82C11.85 10.97 11.87 10.94 11.9 10.9M11.9 20.1C12.26 20.45 12.65 20.74 13.06 21H5C3.9 21 3 20.11 3 19V5C3 3.9 3.9 3 5 3H9.18C9.5 2.16 10.14 1.5 11 1.2C12.53 .64 14.25 1.44 14.82 3H19C20.11 3 21 3.9 21 5V10.82C20.4 10.24 19.72 9.8 19 9.5V5H17V7H7V5H5V19H11.03C11.27 19.39 11.57 19.76 11.9 20.1M11 4C11 4.55 11.45 5 12 5S13 4.55 13 4 12.55 3 12 3 11 3.45 11 4M23.39 21L22 22.39L18.88 19.32C18.19 19.75 17.37 20 16.5 20C14 20 12 18 12 15.5S14 11 16.5 11 21 13 21 15.5C21 16.38 20.75 17.21 20.31 17.9L23.39 21M19 15.5C19 14.12 17.88 13 16.5 13S14 14.12 14 15.5 15.12 18 16.5 18 19 16.88 19 15.5Z"
            />
          </svg>
        </Btn> -->

        <div class="" v-if="selectable">
          <Btn
            v-if="(selectButtonTitle?.length ?? 0) === 0"
            :variant="'icon'"
            :outline="true"
            :tooltip="$t('misc.select')"
            :forceActive="highlighted"
            :disabled="selectionDisabled"
            @click="onSelection()"
            :class="{ 'icon-btn-success': highlighted }"
            ><span class="text-lg material-icons-outlined"> done </span></Btn
          >
          <Tooltip v-else :textValue="selectButtonTitle" :placement="'bottom'">
            <Btn
              :variant="'icon'"
              :outline="true"
              :forceActive="highlighted"
              :disabled="selectionDisabled"
              @click="onSelection()"
              ><span class="text-lg material-icons-outlined"> done </span></Btn
            >
          </Tooltip>
        </div>
      </div>
    </div>
    <Dialog
      :showDialog="showPreview"
      @yes="showPreview = false"
      :confirmOnly="true"
      :large="true"
      :dismissible="true"
    >
      <template v-slot:title>{{ $t("misc.exercise_preview_title") }}</template>
      <template v-slot:body>
        <FullExercise :exercise="exercise"></FullExercise>
      </template>
    </Dialog>
  </div>
</template>

<script lang="ts">
import { getTranslatedString as _ } from "@/i18n";
import { v4 as uuid4 } from "uuid";

import { Exercise, ExerciseState, ExerciseType } from "@/models";
import { defineComponent, PropType } from "@vue/runtime-core";
import Tag from "@/components/ui/Tag.vue";
import MultiIcon from "@/components/ui/MultiIcon.vue";
import { icons as exerciseStatesIcons } from "@/assets/exerciseStatesIcons";
import { icons as exerciseTypesIcons } from "@/assets/exerciseTypesIcons";
import Btn from "@/components/ui/Btn.vue";
import Dialog from "@/components/ui/Dialog.vue";
import FullExercise from "@/components/shared/FullExercise.vue";
import { texMixin } from "@/mixins";
import Tooltip from "@/components/ui/Tooltip.vue";
import FadedEdgesScrollableFragment from "@/components/ui/FadedEdgesScrollableFragment.vue";
import { v4 as uuidv4 } from "uuid";
export default defineComponent({
  name: "MinimalExercisePreview",
  props: {
    exercise: {
      type: Object as PropType<Exercise>,
      required: true,
    },
    highlighted: {
      type: Boolean,
      default: false,
    },
    selectable: {
      type: Boolean,
      default: true,
    },
    previewable: {
      type: Boolean,
      default: true,
    },
    selectionDisabled: {
      type: Boolean,
      default: false,
    },
    selectButtonTitle: {
      type: String,
      default: "",
    },
    expandable: {
      type: Boolean,
      default: false,
    },
    showTags: {
      type: Boolean,
      default: false,
    },
    hoverable: {
      type: Boolean,
      default: false,
    },
    showEdit: {
      type: Boolean,
      default: false,
    },
    reduced: {
      type: Boolean,
      default: false,
    },
  },
  mixins: [texMixin],
  components: {
    Tag,
    MultiIcon,
    Btn,
    Dialog,
    FullExercise,
    Tooltip,
    FadedEdgesScrollableFragment,
  },
  created() {
    this.elementId = uuid4();
    this.tagsDivId = uuid4();
    this.triggerTexRender();
  },
  mounted() {
    setTimeout(
      () =>
        (this.tagsDivWidth =
          document.getElementById(this.tagsDivId)?.parentElement?.clientWidth ??
          0),
      10
    );
  },
  watch: {
    showPreview(newVal) {
      if (newVal) {
        this.triggerTexRender();
      }
    },
  },
  data() {
    return {
      elementId: "",
      showPreview: false,
      ExerciseType,
      tagsDivId: "",
      tagsDivWidth: 0,
    };
  },
  methods: {
    onSelection() {
      this.$emit("selection");
    },
  },
  computed: {
    tagsDivStyle() {
      return `width: ${this.tagsDivWidth ?? 508}px`;
    },
    previewTitle(): string {
      return (this.exercise?.label ?? "").trim().length > 0
        ? (this.exercise.label as string)
        : _("exercise_preview.unnamed_exercise");
    },
    previewText(): string {
      return this.exercise.text;
    },
    exerciseStateIcons() {
      return exerciseStatesIcons[this.exercise.state as ExerciseState];
    },
    exerciseTypeIcons() {
      return exerciseTypesIcons[this.exercise.exercise_type as ExerciseType];
    },
    tags() {
      return [
        ...(this.exercise.public_tags ?? []),
        ...(this.exercise.private_tags ?? []),
      ];
    },
  },
});
</script>

<style></style>
