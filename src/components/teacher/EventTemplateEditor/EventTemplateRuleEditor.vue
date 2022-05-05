<template>
  <div>
    <div
      class="my-3 transition-shadow duration-75 ease-in-out  card shadow-elevation hover-shadow-elevation-2"
      :class="[modelValue._ordering % 2 ? 'bg-white' : 'card-filled']"
    >
      <div class="flex items-center">
        <span
          v-if="!randomOrder"
          class="my-auto mr-2 text-lg cursor-move  drag-handle material-icons-outlined opacity-70"
        >
          drag_indicator
        </span>
        <h4>
          {{ $t("event_template_rule_editor.exercise_number") }}
          {{ modelValue._ordering + 1 }}
        </h4>
        <div class="flex items-center my-auto ml-auto space-x-2">
          <Btn :variant="'secondary'" @click="showRuleDialog()" :size="'sm'">
            <div class="flex items-center">
              <span class="material-icons mr-1.5"> settings </span
              >{{ $t("event_template_rule_editor.choose_exercise") }}
            </div>
          </Btn>
          <!--@click="deleteRule()"-->
          <Btn
            :tooltip="$t('misc.delete')"
            :variant="'icon'"
            :outline="true"
            @click="$emit('deleteRule')"
            ><span
              style="font-size: 17px"
              class="material-icons-outlined text-danger-dark"
            >
              delete
            </span>
          </Btn>
        </div>
      </div>
      <div
        v-if="
          isSlotPopulated &&
          modelValue.rule_type == EventTemplateRuleType.ID_BASED
        "
        class="mt-4"
      >
        <p class="mb-2 text-muted">
          {{
            ruleExercises.length == 1
              ? $t(
                  "event_template_rule_editor.same_exercise_for_everyone_description"
                )
              : $t(
                  "event_template_rule_editor.one_exercise_from_set_description"
                )
          }}
        </p>
        <div>
          <div
            v-if="!loadingPreview"
            :class="[
              ruleExercises.length > 1 ? 'grid md:grid-cols-2 gap-2' : '',
              'overflow-auto',
            ]"
          >
            <MinimalExercisePreview
              v-for="exercise in ruleExercises"
              :key="'r-' + modelValue.id + '-e-' + exercise.id"
              :exercise="exercise"
              :selectable="false"
              :showEdit="false"
              @edit="
                $router.push({
                  name: 'CourseExercises',
                  hash: '#editor-' + exercise.id,
                })
              "
            ></MinimalExercisePreview>
          </div>
          <div v-else class="grid grid-cols-2 gap-2">
            <SkeletonCard :short="true"></SkeletonCard>
            <SkeletonCard :short="true"></SkeletonCard>
          </div>
        </div>
      </div>
      <div
        v-else-if="
          isSlotPopulated &&
          modelValue.rule_type == EventTemplateRuleType.TAG_BASED
        "
        class="mt-4"
      >
        <p class="mb-2 text-muted">
          {{ $t("event_template_rule_editor.tag_based_description") }}
        </p>
        <div class="flex flex-wrap space-x-3">
          <div
            v-for="(clause, index) in modelValue.clauses"
            :key="'clause-preview-' + clause.id"
            class="flex items-center mb-2"
          >
            <p class="mr-2" v-if="clause.tags.length > 1">
              {{ $t("event_template_rule_editor.tag_based_at_least_one") }}
              {{ $t("misc.among") }} <span class="text-xl text-muted">(</span>
            </p>
            <Tag
              class="mx-0.5"
              :class="{ '-ml-1.5': index === 0 }"
              v-for="(tag, index) in clause.tags"
              :key="'clause-' + clause.id + '-tag-' + tag.id"
              :tag="tag"
            ></Tag
            ><span v-if="clause.tags.length > 1" class="text-xl text-muted"
              >)</span
            >
            <p v-if="index !== modelValue.clauses.length - 1">,</p>
          </div>
        </div>
      </div>
      <slot name="error"></slot>
    </div>
    <Dialog
      :showDialog="showDialog"
      :large="true"
      :fullHeight="modelValue.rule_type === EventTemplateRuleType.ID_BASED"
      :footerBorder="true"
      :confirmOnly="true"
      @yes="onCloseDialog()"
    >
      <template v-if="modelValue.rule_type != null" v-slot:backButton>
        <Btn
          :variant="'icon'"
          :outline="true"
          :size="'lg'"
          :tooltip="$t('event_template_rule_editor.reset_slot_settings')"
          class="-ml-3.5 mt-1.25px"
          @click="setRuleMode(null)"
        >
          <span class="material-icons-outlined"> arrow_back </span>
        </Btn>
      </template>
      <template v-slot:title>
        {{
          $t("event_template_rule_editor.populate_slot_title") +
          " " +
          (modelValue._ordering + 1)
        }}
      </template>
      <template v-slot:body>
        <div v-if="modelValue.rule_type == null">
          <p>{{ $t("event_template_rule_editor.mode_selection_text") }}</p>
          <div class="grid grid-cols-1 mt-6 md:grid-cols-3">
            <Btn
              @click="setRuleMode(EventTemplateRuleType.ID_BASED, true)"
              :variant="'transparent'"
              class="pb-4 border-b  md:py-5 md:pl-4 md:border-r md:border-b-0 hoverable-with-two-tone-primary"
            >
              <template v-slot:content>
                <div class="flex items-center justify-center space-x-3">
                  <span
                    class="opacity-50 material-icons-two-tone two-tone-light"
                  >
                    topic
                  </span>
                  <h4 class="">
                    {{ $t("event_template_rule_editor.pick_single_exercise") }}
                  </h4>
                </div>
                <p>
                  {{
                    $t(
                      "event_template_rule_editor.pick_single_exercise_help_text"
                    )
                  }}
                </p></template
              >
            </Btn>
            <Btn
              @click="setRuleMode(EventTemplateRuleType.ID_BASED, false)"
              :variant="'transparent'"
              class="py-4 border-b  md:pl-4 md:pr-3 md:py-0 md:border-r md:border-b-0 hoverable-with-two-tone-primary"
            >
              <template v-slot:content>
                <div class="flex items-center justify-center space-x-3">
                  <span class="opacity-50 material-icons-outlined">
                    shuffle
                  </span>
                  <h4 class="">
                    {{
                      $t("event_template_rule_editor.pick_exercise_from_pool")
                    }}
                  </h4>
                </div>
                <p>
                  {{
                    $t(
                      "event_template_rule_editor.pick_exercise_from_pool_help_text"
                    )
                  }}
                </p></template
              >
            </Btn>
            <Btn
              @click="setRuleMode(EventTemplateRuleType.TAG_BASED)"
              :variant="'transparent'"
              class="pt-4  md:pl-8 md:pt-0 hoverable-with-two-tone-primary md:pr-6"
            >
              <template v-slot:content>
                <div class="flex items-center justify-center space-x-3">
                  <span
                    class="opacity-50 material-icons-two-tone two-tone-light"
                  >
                    label
                  </span>
                  <h4 class="">
                    {{
                      $t("event_template_rule_editor.pick_exercise_tag_based")
                    }}
                  </h4>
                </div>
                <p>
                  {{
                    $t(
                      "event_template_rule_editor.pick_exercise_tag_based_help_text"
                    )
                  }}
                </p>
              </template>
            </Btn>
          </div>
        </div>
        <div v-else-if="modelValue.rule_type == EventTemplateRuleType.ID_BASED">
          <h3 class="text-dark">
            {{
              pickOneExerciseOnly
                ? $t("event_template_rule_editor.pick_single_exercise")
                : $t("event_template_rule_editor.pick_exercise_from_pool")
            }}
          </h3>
          <p>
            {{
              pickOneExerciseOnly
                ? $t(
                    "event_template_rule_editor.pick_single_exercise_help_text"
                  )
                : $t(
                    "event_template_rule_editor.pick_exercise_from_pool_help_text"
                  )
            }}
          </p>
          <div class="mt-4" style="max-height: 60vh">
            <ExercisePicker
              :modelValue="modelValue.exercises"
              :alreadySelected="globallySelectedExercises"
              @addExercise="onAddExercise($event)"
              @removeExercise="onRemoveExercise($event)"
            ></ExercisePicker>
          </div>
        </div>
        <div
          v-else-if="modelValue.rule_type == EventTemplateRuleType.TAG_BASED"
        >
          <TagBasedEventTemplateRuleEditor
            :modelValue="modelValue.clauses"
            :satisfying="modelValue.satisfying"
            @addClause="$emit('addClause')"
            @removeClause="$emit('removeClause', $event)"
            @updateClause="$emit('updateClause', $event)"
          ></TagBasedEventTemplateRuleEditor>
        </div>
      </template>
    </Dialog>
  </div>
</template>

<script lang="ts">
import Dialog from "@/components/ui/Dialog.vue";
import {
  EventTemplateRule,
  EventTemplateRuleType,
  Exercise,
  //Tag as ITag
} from "@/models";
import { defineComponent, PropType } from "@vue/runtime-core";
import Btn from "@/components/ui/Btn.vue";
import ExercisePicker from "@/components/teacher/ExercisePicker.vue";
import MinimalExercisePreview from "../ExerciseEditor/MinimalExercisePreview.vue";
import { getExercisesById } from "@/api/exercises";
import SkeletonCard from "@/components/ui/SkeletonCard.vue";
import { courseIdMixin, loadingMixin } from "@/mixins";
import TagBasedEventTemplateRuleEditor from "./TagBasedEventTemplateRuleEditor.vue";
import Tag from "@/components/ui/Tag.vue";
import { getTranslatedString as _ } from "@/i18n";
// import { eventTemplateRuleValidation } from "@/validation/models";
// import useVuelidate from "@vuelidate/core";

export default defineComponent({
  components: {
    Dialog,
    Btn,
    ExercisePicker,
    MinimalExercisePreview,
    SkeletonCard,
    TagBasedEventTemplateRuleEditor,
    Tag,
  },
  name: "EventTemplateRuleEditor",
  props: {
    modelValue: {
      type: Object as PropType<EventTemplateRule>,
      required: true,
    },
    globallySelectedExercises: {
      type: Object as PropType<string[]>,
      required: true,
    },
    randomOrder: {
      type: Boolean,
      required: true,
    },
  },
  // setup() {
  //   return { v$: useVuelidate() };
  // },
  // validations() {
  //   return {
  //     modelValue: eventTemplateRuleValidation,
  //   };
  // },
  mixins: [courseIdMixin, loadingMixin],
  async created() {
    if (
      this.modelValue.rule_type == EventTemplateRuleType.ID_BASED &&
      (this.modelValue.exercises?.length ?? 0) > 0
    ) {
      this.loadingPreview = true;
      try {
        const previews = await getExercisesById(
          this.courseId,
          this.modelValue.exercises as string[]
        );
        this.previewExercises.push(...previews);
      } catch (e) {
        this.setErrorNotification(e);
      } finally {
        this.loadingPreview = false;
      }
    }
  },
  data() {
    return {
      showDialog: false,
      pickOneExerciseOnly: null as boolean | null,
      previewExercises: [] as Exercise[],
      EventTemplateRuleType,
      loadingPreview: false,
    };
  },
  methods: {
    onCloseDialog() {
      this.showDialog = false;
      this.$emit("ruleDialogClose");
    },
    emitUpdate(key: keyof EventTemplateRule, value: unknown) {
      console.log("EMITTING", { key, value });
      this.$emit("updateRule", {
        field: key,
        value,
      });
    },
    async onAddExercise(exercise: Exercise) {
      if (this.pickOneExerciseOnly) {
        this.emitUpdate("exercises", [exercise.id]);
      } else {
        this.emitUpdate("exercises", [
          exercise.id,
          ...(this.modelValue?.exercises as string[]),
        ]);
      }
      // fetch exercise from server and add to local array for preview
      // TODO the withLoading caused dialog to disappear on adding an exercise - investigate
      // await this.withLoading(async () => {
      const preview = await getExercisesById(this.courseId, [exercise.id]);
      this.previewExercises.push(...preview);
      // });
    },
    onRemoveExercise(exercise: Exercise) {
      // emit modelValue update of new exercise list without removed one
      this.emitUpdate(
        "exercises",
        this.modelValue?.exercises?.filter((e) => e != exercise.id)
      );
      // remove exercise from local array of exercises for preview
      this.previewExercises = this.previewExercises.filter(
        (e) => e.id != exercise.id
      );
    },
    showRuleDialog() {
      this.showDialog = true;
    },
    setRuleMode(ruleType: EventTemplateRuleType, pickOne = false) {
      if (
        ruleType == null &&
        !confirm(_("event_template_rule_editor.unset_rule_type_confirmation"))
      ) {
        return;
      }
      this.emitUpdate("rule_type", ruleType);
      this.pickOneExerciseOnly = pickOne;
    },
  },
  computed: {
    ruleExercises(): Exercise[] {
      if (this.modelValue.rule_type != EventTemplateRuleType.ID_BASED) {
        return [];
      }
      return this.previewExercises;
    },
    isSlotPopulated() {
      if (this.modelValue.rule_type == EventTemplateRuleType.ID_BASED) {
        return (this.modelValue.exercises?.length ?? 0) > 0;
      }
      if (this.modelValue.rule_type == EventTemplateRuleType.TAG_BASED) {
        return (this.modelValue.clauses?.length ?? 0) > 0;
      }
      return false;
    },
  },
});
</script>

<style></style>
