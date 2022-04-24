<template>
  <Card :marginLess="true" :filled="exercise.state === ExerciseState.DRAFT">
    <template v-slot:header>
      <div class="flex flex-wrap md:items-center">
        <h4
          class="order-1 mr-2 md:mr-0"
          :class="{ 'text-muted font-semibold': exercise.label?.length === 0 }"
        >
          {{ previewTitle }}
        </h4>
        <div
          class="flex flex-wrap order-3 mt-1 space-x-1  md:mt-0 md:ml-2 md:order-2"
        >
          <Tag
            v-for="(tag, index) in tags"
            :key="elementId + '-tag-' + index"
            :tag="tag"
          ></Tag>
        </div>
        <div class="order-2 my-auto md:ml-4 md:order-3 chip">
          <div class="flex items-center">
            <MultiIcon class="w-6" :icons="exerciseStateIcons"></MultiIcon>
            <p v-html="$t('exercise_states.' + exercise.state)"></p>
          </div>
        </div>
      </div>
    </template>

    <template v-slot:body>
      <div class="overflow-x-hidden overflow-y-auto overflow-ellipsis max-h-20">
        <div v-html="previewText" class="overflow-ellipsis"></div>
      </div>
    </template>
  </Card>
</template>

<script lang="ts">
import { getTranslatedString as _ } from "@/i18n";
import { v4 as uuid4 } from "uuid";

import Card from "@/components/ui/Card.vue";
import { Exercise, ExerciseState } from "@/models";
import { defineComponent, PropType } from "@vue/runtime-core";
import Tag from "@/components/ui/Tag.vue";
import MultiIcon from "@/components/ui/MultiIcon.vue";
import { icons as exerciseStatesIcons } from "@/assets/exerciseStatesIcons";
import { formatExerciseText, getExerciseTitle } from "@/utils";

export default defineComponent({
  name: "ExercisePreview",
  props: {
    exercise: {
      type: Object as PropType<Exercise>,
      required: true,
    },
  },
  components: {
    Card,
    Tag,
    MultiIcon,
  },
  created() {
    this.elementId = uuid4();
  },
  data() {
    return {
      elementId: "",
      ExerciseState,
    };
  },
  computed: {
    previewTitle(): string {
      return getExerciseTitle(this.exercise);
    },
    previewText(): string {
      return formatExerciseText(this.exercise.text);
    },
    exerciseStateIcons() {
      return exerciseStatesIcons[this.exercise.state as ExerciseState];
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
