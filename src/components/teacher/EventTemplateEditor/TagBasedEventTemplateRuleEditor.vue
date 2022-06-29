<template>
  <div>
    <p class="mb-6 text-muted" v-if="showTeacherIntroductionText">
      {{ $t("event_template_rule_editor.tag_based_introduction") }}
    </p>
    <div
      class="flex flex-col mb-12"
      v-if="showTeacherIntroductionText && tags.length === 0"
    >
      <!-- TODO make nicer empty state -->
      <p class="mb-2 text-muted text-danger-dark">
        {{ $t("event_template_rule_editor.no_tags") }}
      </p>
      <router-link class="mx-auto link" :to="{ name: 'CourseExercises' }"
        ><Btn :variant="'primary-borderless'">{{
          $t("exercise_picker.go_to_exercises")
        }}</Btn></router-link
      >
    </div>
    <div
      class="flex flex-col"
      v-if="!showTeacherIntroductionText && tags.length === 0"
    >
      <p class="mb-2 text-muted text-danger-dark">
        {{ $t("event_template_rule_editor.no_tags_student") }}
      </p>
    </div>
    <div
      :class="{
        'opacity-50 cursor-not-allowed pointer-events-none': tags.length === 0,
      }"
      class="flex flex-col items-start space-y-4 md:flex-row md:space-y-0"
    >
      <div
        v-if="showTeacherIntroductionText || tags.length > 0"
        class="flex flex-col w-full"
      >
        <div
          v-for="(clause, index) in modelValue"
          :key="'clause-' + clause.id"
          class="my-2"
        >
          <p v-if="index === 0" class="mb-2">
            {{ $t("event_template_rule_editor.tag_based_select_exercises") }}
            <strong>{{
              $t("event_template_rule_editor.tag_based_at_least_one")
            }}</strong>
            {{ $t("event_template_rule_editor.tag_based_among") }}
          </p>
          <p v-else>
            {{ $t("event_template_rule_editor.tag_based_and") }}
            <strong>{{
              $t("event_template_rule_editor.tag_based_at_least_one")
            }}</strong>
            {{ $t("event_template_rule_editor.tag_based_among") }}
          </p>
          <div class="flex items-center space-x-2">
            <TagInput
              :placeholder="$t('misc.tags')"
              :modelValue="clause.tags"
              :alwaysShowAutocomplete="!allowCreateMoreClauses"
              @addTag="onAddTag(clause, $event)"
              @removeTag="onRemoveTag(clause, $event)"
              :choices="tags"
              :existingOnly="true"
              class="w-full"
            ></TagInput>
            <!-- delete button -->
            <Btn
              :tooltip="$t('misc.delete')"
              :variant="'icon'"
              :outline="true"
              @click="$emit('deleteClause', clause.id)"
              class="transition-opacity duration-100 opacity-50  hover:opacity-100"
              ><span style="font-size: 17px" class="material-icons">
                delete
              </span>
            </Btn>
          </div>
        </div>

        <!-- ghost clause -->
        <div
          v-if="allowCreateMoreClauses"
          @click="onAddClause"
          class="mt-2 transition-opacity duration-75 opacity-50 cursor-pointer  hover:opacity-100"
        >
          <p>
            {{ $t("event_template_rule_editor.tag_based_and") }}
            <strong>{{
              $t("event_template_rule_editor.tag_based_at_least_one")
            }}</strong>
            {{ $t("event_template_rule_editor.tag_based_among") }}
          </p>
          <div class="flex items-center space-x-2">
            <TagInput
              :disabled="true"
              class="w-full cursor-pointer"
              :placeholder="$t('exercise_editor.exercise_tags')"
              :modelValue="[]"
            ></TagInput>
            <Btn :variant="'icon'" :outline="true" class="invisible"
              ><span style="font-size: 17px" class="material-icons">
                delete
              </span>
            </Btn>
          </div>
        </div>
      </div>

      <!-- preview card -->
      <div
        v-if="showPreview"
        class="relative flex mb-auto  card shadow-elevation md:w-9/12 md:ml-16 md:max-h-96 card-filled"
      >
        <Spinner
          :size="'xl'"
          :fast="true"
          class="absolute transform -translate-x-1/2 -translate-y-1/2  top-1/2 left-1/2"
          v-if="localLoading"
        ></Spinner>
        <div
          class="flex flex-col flex-grow"
          :class="{ 'opacity-50 pointer-events-none': localLoading }"
        >
          <p class="mb-8 text-lg text-muted">
            {{ $t("event_template_rule_editor.eligible_exercises") }}
            <strong>{{ satisfying.count }}</strong>
          </p>
          <h4 v-if="!!satisfying.example" class="mt-auto">
            {{ $t("misc.example") }}
          </h4>
          <MinimalExercisePreview
            :selectable="false"
            :previewable="false"
            :showTags="true"
            v-if="!!satisfying.example"
            :exercise="satisfying.example"
          ></MinimalExercisePreview>
          <div
            v-else
            class="flex flex-col items-center mt-2 mb-auto opacity-70"
          >
            <span
              class="mb-4 opacity-50 material-icons-outlined"
              style="font-size: 5rem"
              >error_outline</span
            >
            <p class="mb-4 select-none">
              {{ $t("event_template_rule_editor.unsatisfiable_tag_rule") }}
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { tagNamesToTags } from "@/api/utils";
import TagInput from "@/components/ui/TagInput.vue";
import { courseIdMixin, eventIdMixin, loadingMixin } from "@/mixins";
import { EventTemplateRuleClause, Exercise, Tag } from "@/models";
import { defineComponent, PropType } from "@vue/runtime-core";

import { createNamespacedHelpers } from "vuex";
import MinimalExercisePreview from "../ExerciseEditor/MinimalExercisePreview.vue";
import Spinner from "@/components/ui/Spinner.vue";
import Btn from "@/components/ui/Btn.vue";
const { mapState } = createNamespacedHelpers("shared");

export default defineComponent({
  components: { TagInput, MinimalExercisePreview, Spinner, Btn },
  name: "TagBasedEventTemplateRuleEditor",
  async created() {
    if (this.modelValue.length === 0) {
      this.onAddClause();
    }
  },
  props: {
    modelValue: {
      type: Array as PropType<EventTemplateRuleClause[]>,
      required: true,
    },
    satisfying: {
      type: Object as PropType<{ count: number; example?: Exercise }>,
      default: () => ({
        count: 0,
      }),
    },
    showTeacherIntroductionText: {
      type: Boolean,
      default: true,
    },
    allowCreateMoreClauses: {
      type: Boolean,
      default: true,
    },
    showPreview: {
      type: Boolean,
      default: true,
    },
  },
  mixins: [courseIdMixin, eventIdMixin, loadingMixin],
  methods: {
    onAddClause() {
      this.$emit("addClause");
    },
    onAddTag(clause: EventTemplateRuleClause, newTagName: string) {
      const newTag = tagNamesToTags([newTagName])[0];

      this.$emit("updateClause", {
        ...clause,
        tags: [...clause.tags, newTag],
      } as EventTemplateRuleClause);
    },
    onRemoveTag(clause: EventTemplateRuleClause, removedTagName: string) {
      const removedTag = tagNamesToTags([removedTagName])[0];

      this.$emit("updateClause", {
        ...clause,
        tags: clause.tags.filter((t) => t.id != removedTag.id),
      } as EventTemplateRuleClause);
    },
  },
  computed: {
    ...mapState(["tags"]),
  },
});
</script>

<style></style>
