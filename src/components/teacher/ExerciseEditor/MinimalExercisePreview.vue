<template>
  <div>
    <Card
      :size="'sm'"
      :highlighted="highlighted"
      :hoverable="hoverable"
      :class="{
        'border-success': highlighted,
        'bg-gray-50 opacity-60': selectionDisabled,
      }"
    >
      <template v-slot:header>
        <div class="relative">
          <div class="flex items-center mb-2">
            <h5
              class="mr-2"
              :class="{
                'text-muted font-semibold': exercise.label?.length === 0,
              }"
            >
              {{ previewTitle }}
            </h5>
            <Tooltip
              :noArrow="true"
              :placement="'bottom'"
              :textValue="$t('exercise_states.' + exercise.state)"
            >
              <div class="my-auto cursor-default chip chip-sm">
                <div class="flex items-center">
                  <MultiIcon
                    class="w-6"
                    :icons="exerciseStateIcons"
                  ></MultiIcon>
                </div></div
            ></Tooltip>
          </div>
          <div
            v-if="true || showTags"
            class="flex items-center overflow-x-auto faded-slideshow"
          >
            <Tag
              class="mr-1"
              :class="{ 'z-10': index === tags.length - 1 }"
              v-for="(tag, index) in tags"
              :key="elementId + '-tag-' + index"
              :tag="tag"
              :small="true"
            ></Tag>
          </div>
        </div>
      </template>

      <template v-slot:body>
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
        <div class="flex items-center -my-3">
          <Btn
            class="ml-auto"
            v-if="previewable"
            :variant="'icon'"
            :outline="true"
            :tooltip="$t('misc.preview')"
            @click="showPreview = true"
            ><span class="text-xl material-icons-outlined"> fullscreen </span>
          </Btn>
          <router-link
            class=""
            :outline="true"
            v-if="showEdit"
            :to="{ name: 'CourseExercises', hash: '#editor-' + exercise.id }"
            ><Btn :outline="true" :variant="'icon'" :tooltip="$t('misc.edit')">
              <span class="text-lg material-icons"> edit </span>
            </Btn></router-link
          >
          <div class="" v-if="selectable">
            <Btn
              v-if="(selectButtonTitle?.length ?? 0) === 0"
              :variant="'icon'"
              :outline="true"
              :tooltip="$t('misc.select')"
              :forceActive="highlighted"
              :disabled="selectionDisabled"
              @click="onSelection()"
              class="icon-btn-success"
              ><span class="text-lg material-icons-outlined"> done </span></Btn
            >
            <Tooltip
              v-else
              :textValue="selectButtonTitle"
              :placement="'bottom'"
            >
              <Btn
                :variant="'icon'"
                :outline="true"
                :forceActive="highlighted"
                :disabled="selectionDisabled"
                @click="onSelection()"
                ><span class="text-lg material-icons-outlined">
                  done
                </span></Btn
              >
            </Tooltip>
          </div>
        </div>
      </template>
    </Card>
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

import Card from "@/components/ui/Card.vue";
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
  },
  mixins: [texMixin],
  components: {
    Card,
    Tag,
    MultiIcon,
    Btn,
    Dialog,
    FullExercise,
    Tooltip,
  },
  created() {
    this.elementId = uuid4();
    this.triggerTexRender();
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
    };
  },
  methods: {
    onSelection() {
      this.$emit("selection");
    },
  },
  computed: {
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
