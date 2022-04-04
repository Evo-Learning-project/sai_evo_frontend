<template>
  <div class="relative">
    <transition name="fade-delay">
      <div
        style="z-index: 59"
        v-show="exerciseLocked"
        class="absolute top-0 left-0 flex items-center justify-center w-full h-full"
      >
        <div
          style="width: 100% !important; height: 100% !important"
          class="absolute z-10 flex w-full h-full transition-none bg-gray-900 rounded opacity-40"
        ></div>
        <div
          class="sticky z-50 mx-auto text-center transform rounded -translate-y-3/4 top-1/2 md:top-1/4 md:w-max"
        >
          <p
            style="font-size: 10rem"
            class="opacity-50 material-icons-outlined text-lightText"
          >
            {{ exerciseLocked ? "lock" : "lock_open" }}
          </p>
          <h3
            :class="[!exerciseLocked ? 'opacity-0' : 'opacity-100']"
            class="pt-1 mx-auto rounded-t md:bg-transparent text-lightText"
            style="text-shadow: 0.5px 0.5px 4px rgb(0 0 0 / 50%)"
          >
            {{ $t("exercise_editor.currently_locked_by") }}
            {{ modelValue?.locked_by?.full_name }}
          </h3>
          <p
            :class="[!exerciseLocked ? 'opacity-0' : 'opacity-100']"
            class="pb-1 rounded-b md:bg-transparent text-lightText md:mx-2 md:px-2"
            style="text-shadow: 0.5px 0.5px 4px rgb(0 0 0 / 50%)"
          >
            {{ $t("event_editor.lock_stand_by") }}
          </p>
        </div>
      </div>
    </transition>
    <div
      @click="onFocusNonDraft"
      style="z-index: 20"
      class="absolute top-0 left-0 w-full h-full bg-gray-500 bg-opacity-0 cursor-pointer"
      v-if="false && modelValue.state !== ExerciseState.DRAFT && preventEdit"
    ></div>
    <!-- FIXME review shadow -->
    <Card
      :focusable="!subExercise"
      :hoverable="!subExercise"
      :marginLess="true"
      :borderLess="subExercise"
      class=""
      :class="{
        'bg-gray-50': modelValue.state === ExerciseState.DRAFT,
        'bg-light mb-6 md:-mx-5 -mx-2.5': subExercise,
        'transition-shadow duration-100 focus-within:shadow-lg': !subExercise,
      }"
    >
      <template v-slot:header>
        <div class="flex" v-if="!subExercise">
          <h3 v-if="!subExercise">
            {{ $t("exercise_editor.exercise_editor_title") }}
            <span v-if="modelValue.state === ExerciseState.DRAFT" class="text-muted"
              >({{ $t("exercise_editor.draft_notice") }})</span
            >
          </h3>
          <CloudSaveStatus
            class="my-auto ml-auto mr-8"
            :saving="saving"
            :hadError="savingError"
          ></CloudSaveStatus>
        </div>
      </template>
      <template v-slot:body>
        <div v-if="!subExercise || !cloze" class="flex flex-col space-y-6">
          <div
            v-if="!subExercise || !cloze"
            class="flex flex-col items-start my-4 space-y-5 md:space-x-8 md:space-y-0 md:flex-row"
          >
            <div v-if="!subExercise" class="w-full mr-auto md:w-4/12">
              <TextInput
                :modelValue="modelValue.label"
                @update:modelValue="onBaseExerciseChange('label', $event)"
                >{{ $t("exercise_editor.exercise_label") }}</TextInput
              >
            </div>
            <div v-if="!subExercise" class="self-start w-full mr-auto md:w-3/12">
              <Dropdown
                :id="'exercise_state_' + elementId"
                :options="exerciseStateOptions"
                :modelValue="modelValue.state"
                @update:modelValue="onExerciseStateChange($event)"
              >
                <!--onBaseExerciseChange('state', $event)-->
                {{ $t("exercise_editor.exercise_state") }}
              </Dropdown>
            </div>
            <div
              v-if="!cloze"
              :class="{ 'md:ml-auto': !subExercise }"
              class="flex flex-col w-full md:flex-row md:w-5/12"
            >
              <Dropdown
                class="w-full"
                :id="'exercise_type_' + elementId"
                :options="exerciseTypeOptions"
                :modelValue="modelValue.exercise_type"
                @update:modelValue="onExerciseTypeChange($event)"
              >
                {{ $t("exercise_editor.exercise_type") }}
              </Dropdown>
              <!--              :modelValue="modelValue.exercise_type"
              @update:modelValue="onExerciseTypeChange($event)"-->
            </div>
          </div>
          <TextEditor
            v-if="!cloze"
            :modelValue="modelValue.text"
            @ready="textEditorInstance = $event"
            @selectionChange="onTextSelectionChange($event)"
            @update:modelValue="onBaseExerciseChange('text', $event)"
            >{{ $t("exercise_editor.exercise_text") }}</TextEditor
          >
          <div
            class="flex flex-wrap space-y-1 md:space-x-2 md:space-y-0"
            v-if="modelValue.exercise_type === ExerciseType.COMPLETION"
          >
            <Btn @click="onAddCloze()"
              ><span class="mr-1.5 text-base material-icons-outlined">
                add_circle_outline </span
              >{{ $t("exercise_editor.new_cloze") }}</Btn
            >
            <Btn
              :disabled="editableClozePosition === null"
              @click="editingClozePosition = editableClozePosition"
              ><span class="mr-1.5 text-base material-icons-outlined"> edit </span
              >{{ $t("exercise_editor.edit_cloze") }}</Btn
            >
            <Tooltip class="" :text-code="'exercise_editor.clozes'"></Tooltip>
          </div>
          <div v-if="!cloze">
            <TextEditor
              v-if="!cloze && modelValue.exercise_type !== ExerciseType.JS"
              :modelValue="modelValue.solution"
              @update:modelValue="onBaseExerciseChange('solution', $event)"
              >{{ $t("exercise_editor.exercise_solution") }}</TextEditor
            >
            <CodeEditor
              :modelValue="modelValue.solution"
              @update:modelValue="onBaseExerciseChange('solution', $event)"
              v-else-if="!cloze"
              >{{ $t("exercise_editor.exercise_solution") }}</CodeEditor
            >
            <Tooltip
              v-if="!cloze"
              class=""
              :text-code="'exercise_editor.solution'"
            ></Tooltip>
          </div>

          <div v-if="!subExercise">
            <TagInput
              :choices="tags"
              :modelValue="modelValue.public_tags ?? []"
              :allow-edit-tags="false"
              :placeholder="$t('exercise_editor.exercise_public_tags')"
              @addTag="onAddTag($event, true)"
              @removeTag="onRemoveTag($event, true)"
            ></TagInput>
            <Tooltip class="" :text-code="'exercise_editor.public_tags'"></Tooltip>
          </div>

          <div v-if="!subExercise">
            <TagInput
              :choices="tags"
              :modelValue="modelValue.private_tags ?? []"
              :allow-edit-tags="false"
              :placeholder="$t('exercise_editor.exercise_private_tags')"
              @addTag="onAddTag($event, false)"
              @removeTag="onRemoveTag($event, false)"
            ></TagInput>
            <Tooltip class="" :text-code="'exercise_editor.private_tags'"></Tooltip>
          </div>
        </div>
        <!-- Multiple-choice exercise types settings -->
        <div :class="[cloze ? '-mt-6' : 'mt-8']" v-if="isMultipleChoice">
          <h3 class="mb-8">{{ $t("exercise_editor.choices_title") }}</h3>
          <draggable
            handle=".drag-handle"
            :modelValue="modelValue.choices"
            @end="onChoiceDragEnd($event)"
            ghost-class="drag-ghost"
            item-key="id"
          >
            <template #item="{ element }">
              <ChoiceEditor
                :single-line="cloze"
                :modelValue="element"
                @choiceUpdate="onUpdateChoice(element.id, $event.field, $event.value)"
                :icon-type="
                  modelValue.exercise_type ===
                  ExerciseType.MULTIPLE_CHOICE_SINGLE_POSSIBLE
                    ? 'radio'
                    : 'checkbox'
                "
              ></ChoiceEditor>
            </template>
          </draggable>
          <Btn @click="onAddChoice()" :size="'sm'"
            ><span class="mr-1 text-base material-icons-outlined">
              add_circle_outline
            </span>
            {{ $t("exercise_editor.new_choice") }}</Btn
          >
        </div>
        <!-- Completion exercise settings -->
        <!-- <h3 class="mt-8 mb-8">{{ $t("exercise_editor.clozes_title") }}</h3>

        <div class="grid grid-cols-2 gap-4">
          <ClozeEditor
            v-for="subExercise in modelValue.sub_exercises"
            :key="'exercise-' + modelValue.id + '-cloze-' + subExercise.id"
            :modelValue="subExercise"
          ></ClozeEditor>
        </div> -->

        <!-- Aggregated exercise settings -->
        <div class="mt-8" v-if="modelValue.exercise_type === ExerciseType.AGGREGATED">
          <h3 class="mb-8">{{ $t("exercise_editor.sub_exercises_title") }}</h3>
          <draggable
            :modelValue="modelValue.sub_exercises"
            @end="onChoiceDragEnd($event)"
            ghost-class="drag-ghost"
            item-key="id"
          >
            <template #item="{ element }">
              <ExerciseEditor :subExercise="true" :modelValue="element"></ExerciseEditor>
            </template>
          </draggable>
          <Btn @click="onAddSubExercise()" :size="'sm'"
            ><span class="mr-1 text-base material-icons-outlined">
              add_circle_outline
            </span>
            {{ $t("exercise_editor.new_sub_exercise") }}</Btn
          >
        </div>

        <!-- Js exercise settings -->
        <div class="mt-8" v-if="modelValue.exercise_type === ExerciseType.JS">
          <CodeEditor v-if="false"></CodeEditor>
          <h3 class="mb-8">{{ $t("exercise_editor.testcases_title") }}</h3>

          <draggable
            :modelValue="modelValue.testcases"
            ghost-class="drag-ghost"
            item-key="id"
          >
            <template #item="{ element }">
              <TestCaseEditor
                :modelValue="element"
                @testCaseUpdate="onUpdateTestCase(element.id, $event.field, $event.value)"
              ></TestCaseEditor>
            </template>
          </draggable>
          <Btn @click="onAddTestCase()" :size="'sm'"
            ><span class="mr-1 text-base material-icons-outlined">
              add_circle_outline
            </span>
            {{ $t("exercise_editor.new_choice") }}</Btn
          >
        </div>
        <Dialog
          :large="true"
          :confirmOnly="true"
          @yes="editingClozePosition = null"
          v-if="modelValue.exercise_type === ExerciseType.COMPLETION"
          :showDialog="!!editingCloze"
        >
          <template v-slot:title>
            {{ $t("exercise_editor.editing_cloze") }}
            {{ editingClozePosition + 1 }}
          </template>
          <template v-slot:body>
            <ExerciseEditor
              :modelValue="editingCloze"
              :sub-exercise="true"
              :cloze="true"
            ></ExerciseEditor
          ></template>
        </Dialog>
        <Dialog
          :showDialog="showDialog"
          @yes="dialogData.onYes()"
          @no="dialogData.onNo()"
          :yesText="dialogData.yesText"
          :noText="dialogData.noText"
          :error="dialogData.error"
          :confirmOnly="dialogData.confirmOnly"
        >
          <template v-slot:title>{{ dialogData.title }}</template>
          <template v-slot:body
            >{{ dialogData.text }}
            <div class="mt-2" v-if="showValidationErrors">
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
          </template>
        </Dialog>
      </template>
    </Card>
  </div>
</template>

<script lang="ts">
import { getTranslatedString as _ } from "@/i18n";
import { icons as exerciseTypesIcons } from "@/assets/exerciseTypesIcons";
import { icons as exerciseStatesIcons } from "@/assets/exerciseStatesIcons";
import { v4 as uuid4 } from "uuid";
import Dropdown from "@/components/ui/Dropdown.vue";
import Dialog from "@/components/ui/Dialog.vue";
import draggable from "vuedraggable";

import {
  getBlankChoice,
  Exercise,
  ExerciseState,
  ExerciseChoice,
  getExerciseValidationErrors,
  ExerciseType,
  ExerciseTestCase,
  getBlankTestCase,
  getBlankExercise,
} from "@/models";
import { multipleChoiceExerciseTypes } from "@/models";
import Card from "@/components/ui/Card.vue";
//import Dropdown from '@/components/ui/Dropdown.vue'
import { defineComponent, PropType } from "@vue/runtime-core";
import TextEditor from "@/components/ui/TextEditor.vue";
import TextInput from "@/components/ui/TextInput.vue";
import Btn from "@/components/ui/Btn.vue";
import TagInput from "@/components/ui/TagInput.vue";

import ChoiceEditor from "@/components/teacher/ExerciseEditor/ChoiceEditor.vue";
import CloudSaveStatus from "@/components/ui/CloudSaveStatus.vue";
import { courseIdMixin, savingMixin } from "@/mixins";
import { DialogData } from "@/interfaces";

import { createNamespacedHelpers, mapActions } from "vuex";
import { AutoSaveManager } from "@/autoSave";
import {
  exerciseStateOptions,
  exerciseTypeOptions,
  EXERCISE_AUTO_SAVE_DEBOUNCED_FIELDS,
  EXERCISE_AUTO_SAVE_DEBOUNCE_TIME_MS,
  EXERCISE_CHOICE_AUTO_SAVE_DEBOUNCED_FIELDS,
  EXERCISE_CHOICE_AUTO_SAVE_DEBOUNCE_TIME_MS,
  TEST_CASE_AUTO_SAVE_DEBOUNCED_FIELDS,
  TEST_CASE_AUTO_SAVE_DEBOUNCE_TIME_MS,
  CLOZE_SEPARATOR,
} from "@/const";
import CodeEditor from "@/components/ui/CodeEditor.vue";
import TestCaseEditor from "./TestCaseEditor.vue";
import Tooltip from "@/components/ui/Tooltip.vue";
import { subscribeToExerciseChanges } from "@/ws/modelSubscription";
// import ClozeEditor from "./ClozeEditor.vue";
const { mapMutations } = createNamespacedHelpers("teacher");
const { mapState } = createNamespacedHelpers("shared");

export default defineComponent({
  name: "ExerciseEditor",
  components: {
    Card,
    TextEditor,
    TextInput,
    Dropdown,
    ChoiceEditor,
    Btn,
    TagInput,
    CloudSaveStatus,
    Dialog,
    draggable,
    CodeEditor,
    TestCaseEditor,
    Tooltip,
    // ClozeEditor,
  },
  props: {
    modelValue: {
      type: Object as PropType<Exercise>,
      required: true,
    },
    subExercise: {
      // hides certain fields depending on whether the exercise
      // is a base- or sub-exercise
      type: Boolean,
      default: false,
    },
    cloze: {
      // hides certain fields depending on whether the exercise is a cloze
      type: Boolean,
      default: false,
    },
  },
  mixins: [courseIdMixin, savingMixin],
  beforeUnmount() {
    this.ws?.close();
  },
  async created() {
    if (!this.subExercise) {
      this.ws = await subscribeToExerciseChanges(this.modelValue.id);
    }

    this.autoSaveManager = new AutoSaveManager<Exercise>(
      this.modelValue,
      async (changes) =>
        await this.updateExercise({
          courseId: this.courseId,
          exercise: { ...this.modelValue, ...changes },
        }),
      (changes) => {
        this.saving = true;
        this.savingError = false;
        this.setExercise({ ...this.modelValue, ...changes });
      },
      EXERCISE_AUTO_SAVE_DEBOUNCED_FIELDS,
      EXERCISE_AUTO_SAVE_DEBOUNCE_TIME_MS,
      undefined,
      () => (this.savingError = true),
      () => (this.saving = false)
    );

    this.modelValue.choices?.forEach((c) => this.instantiateChoiceAutoSaveManager(c));
    this.modelValue.testcases?.forEach((t) => this.instantiateTestCaseAutoSaveManager(t));
  },
  data() {
    return {
      autoSaveManager: null as AutoSaveManager<Exercise> | null,
      choiceAutoSaveManagers: {} as Record<string, AutoSaveManager<ExerciseChoice>>,
      testCaseAutoSaveManagers: {} as Record<string, AutoSaveManager<ExerciseTestCase>>,
      elementId: uuid4(),
      showSaved: false,
      saving: false,
      savingError: false,
      showDialog: false,
      showValidationErrors: false,
      preventEdit: true,
      dialogData: {
        title: "",
        text: "",
        onNo: null as null | (() => void),
        onYes: null as null | (() => void),
        error: false,
        confirmOnly: false,
      } as DialogData,
      exerciseStateOptions,
      ExerciseState,
      ExerciseType,
      ws: null as WebSocket | null,
      textEditorInstance: null as any,
      editingClozePosition: null as number | null,
      editableClozePosition: null as number | null,
    };
  },
  methods: {
    ...mapActions("teacher", [
      "updateExercise",
      "addExerciseChoice",
      "addExerciseSubExercise",
      "addExerciseTestCase",
      "updateExerciseChoice",
      "addExerciseTag",
      "removeExerciseTag",
      "updateExerciseChild",
    ]),
    ...mapActions("shared", ["getTags"]),
    ...mapMutations(["setExercise", "setExerciseChild"]),
    async onChoiceDragEnd(event: { oldIndex: number; newIndex: number }) {
      const draggedChoice = (this.modelValue.choices as ExerciseChoice[])[event.oldIndex];

      if (event.oldIndex !== event.newIndex) {
        await this.onUpdateChoice(draggedChoice.id, "_ordering", event.newIndex);
      }
    },
    async onBaseExerciseChange(key: keyof Exercise, value: unknown) {
      await this.autoSaveManager?.onChange({ field: key, value });
    },
    onFocusNonDraft() {
      this.showDialog = true;
      this.dialogData = {
        title: _("exercise_editor.edit_non_draft_title"),
        text: _("exercise_editor.edit_non_draft_body"),
        yesText: _("misc.edit"),
        noText: _("dialog.default_cancel_text"),
        onNo: () => (this.showDialog = false),
        onYes: () => {
          this.preventEdit = false;
          this.showDialog = false;
        },
      };
    },
    onTextSelectionChange(event: {
      fullText: string;
      text: string;
      range: { index: number; length: number };
    }) {
      if (this.modelValue.exercise_type !== ExerciseType.COMPLETION) {
        return;
      }
      const clozeSeparatorPositions = [...event.fullText.matchAll(/\[\[\?\]\]/g)].map(
        (m) => m.index as number
      );
      console.log(event);
      if (event.range.length === 0 && event.text.includes(CLOZE_SEPARATOR)) {
        let i = 0;
        for (const p of clozeSeparatorPositions) {
          console.log(p);
          if (
            event.range.index >= p &&
            event.range.index + event.range.length <= p + CLOZE_SEPARATOR.length
          ) {
            this.editableClozePosition = i;
            return;
          }
          i++;
        }
      }
      this.editableClozePosition = null;
    },
    onExerciseTypeChange(newVal: ExerciseType) {
      this.onBaseExerciseChange("exercise_type", newVal);
    },
    async onAddChoice() {
      const newChoice: ExerciseChoice = await this.addExerciseChoice({
        courseId: this.courseId,
        exerciseId: this.modelValue.id,
        choice: getBlankChoice(),
      });
      this.instantiateChoiceAutoSaveManager(newChoice);
    },
    async onAddSubExercise() {
      const newSubExercise: Exercise = await this.addExerciseSubExercise({
        courseId: this.courseId,
        exerciseId: this.modelValue.id,
        subExercise: getBlankExercise(),
      });
      return newSubExercise;
    },
    async onAddCloze() {
      const selection = this.textEditorInstance.getSelection();
      console.log(selection);
      const insertionIndex = selection.index + selection.length;
      this.textEditorInstance.insertText(insertionIndex, CLOZE_SEPARATOR);
      await this.onAddSubExercise();
      // focus on most recently added cloze
      this.editingClozePosition =
        (this.modelValue.sub_exercises as Exercise[]).length - 1;
    },
    async onAddTestCase() {
      const newTestcase: ExerciseTestCase = await this.addExerciseTestCase({
        courseId: this.courseId,
        exerciseId: this.modelValue.id,
        testCase: getBlankTestCase(),
      });
      this.instantiateTestCaseAutoSaveManager(newTestcase);
    },
    async onAddTag(tag: string, isPublic: boolean) {
      await this.addExerciseTag({
        courseId: this.courseId,
        exerciseId: this.modelValue.id,
        tag,
        isPublic,
      });
      await this.getTags(this.courseId);
    },
    async onRemoveTag(tag: string, isPublic: boolean) {
      await this.removeExerciseTag({
        courseId: this.courseId,
        exerciseId: this.modelValue.id,
        tag,
        isPublic,
      });
    },
    onExerciseStateChange(newState: ExerciseState) {
      if (newState != ExerciseState.DRAFT && this.validationErrors.length > 0) {
        this.showDialog = true;
        this.showValidationErrors = true;
        this.dialogData = {
          title: _("exercise_editor.cannot_publish"),
          text: _("exercise_editor.cannot_publish_body"),
          onYes: () => {
            this.showDialog = false;
            this.showValidationErrors = false;
          },
          error: true,
          confirmOnly: true,
        };
        return;
      }
      if (newState == ExerciseState.PUBLIC) {
        this.showDialog = true;
        this.dialogData = {
          title: _("exercise_editor.make_public_confirmation_title"),
          text: _("exercise_editor.make_public_confirmation_body"),
          onYes: () => {
            this.onBaseExerciseChange("state", newState);
            this.showDialog = false;
          },
          onNo: () => (this.showDialog = false),
          error: false,
          confirmOnly: false,
        };
      } else {
        this.onBaseExerciseChange("state", newState);
      }
    },
    async onUpdateChoice(choiceId: string, key: keyof ExerciseChoice, value: unknown) {
      await this.choiceAutoSaveManagers[choiceId].onChange({
        field: key,
        value,
      });
    },
    async onUpdateTestCase(
      testCaseId: string,
      key: keyof ExerciseTestCase,
      value: unknown
    ) {
      await this.testCaseAutoSaveManagers[testCaseId].onChange({
        field: key,
        value,
      });
    },
    instantiateChoiceAutoSaveManager(choice: ExerciseChoice) {
      this.choiceAutoSaveManagers[choice.id] = new AutoSaveManager<ExerciseChoice>(
        choice,
        async (changes) => {
          // if choices are re-ordered, re-fetch them from server
          const reFetch = Object.keys(changes).includes("_ordering");
          await this.updateExerciseChild({
            childType: "choice",
            courseId: this.courseId,
            exerciseId: this.modelValue.id,
            payload: { ...choice, ...changes },
            reFetch,
          });
        },
        (changes) => {
          this.saving = true;
          this.savingError = false;
          this.setExerciseChild({
            childType: "choice",
            exerciseId: this.modelValue.id,
            payload: { ...choice, ...changes },
          });
        },
        EXERCISE_CHOICE_AUTO_SAVE_DEBOUNCED_FIELDS,
        EXERCISE_CHOICE_AUTO_SAVE_DEBOUNCE_TIME_MS,
        undefined,
        () => (this.savingError = true),
        () => (this.saving = false)
      );
    },
    instantiateTestCaseAutoSaveManager(testcase: ExerciseTestCase) {
      this.testCaseAutoSaveManagers[testcase.id] = new AutoSaveManager<ExerciseTestCase>(
        testcase,
        async (changes) => {
          // if choices are re-ordered, re-fetch them from server
          const reFetch = Object.keys(changes).includes("_ordering");
          await this.updateExerciseChild({
            childType: "testcase",
            courseId: this.courseId,
            exerciseId: this.modelValue.id,
            payload: { ...testcase, ...changes },
            reFetch,
          });
        },
        (changes) => {
          this.saving = true;
          this.savingError = false;
          this.setExerciseChild({
            childType: "testcase",
            exerciseId: this.modelValue.id,
            payload: { ...testcase, ...changes },
          });
        },
        TEST_CASE_AUTO_SAVE_DEBOUNCED_FIELDS,
        TEST_CASE_AUTO_SAVE_DEBOUNCE_TIME_MS,
        undefined,
        () => (this.savingError = true),
        () => (this.saving = false)
      );
    },
  },
  computed: {
    ...mapState(["tags", "user"]),
    isMultipleChoice(): boolean {
      return multipleChoiceExerciseTypes.includes(
        parseInt((this.modelValue.exercise_type?.toString() ?? "") as string)
      );
    },
    validationErrors() {
      return getExerciseValidationErrors(this.modelValue).map((e) =>
        _("exercise_validation_errors." + e)
      );
    },
    exerciseTypeOptions() {
      return exerciseTypeOptions.filter(
        (o) => !this.subExercise || o.value !== ExerciseType.AGGREGATED
      );
    },
    exerciseLocked(): boolean {
      console.log("locked", this.modelValue.locked_by);
      return !!this.modelValue.locked_by && this.modelValue.locked_by.id != this.user.id;
    },
    editingCloze(): Exercise | null {
      if (this.editingClozePosition === null) {
        return null;
      }
      return (this.modelValue.sub_exercises as Exercise[])[this.editingClozePosition];
    },
  },
});
</script>

<style></style>
