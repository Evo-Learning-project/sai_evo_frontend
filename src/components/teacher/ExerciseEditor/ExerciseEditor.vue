<template>
  <div class="relative">
    <div
      @click="onFocusNonDraft"
      style="z-index: 20"
      class="absolute top-0 left-0 w-full h-full bg-gray-500 bg-opacity-0 cursor-pointer "
      v-if="modelValue.state !== ExerciseState.DRAFT && preventEdit"
    ></div>
    <!-- FIXME review shadow -->
    <Card
      :marginLess="true"
      class="transition-shadow duration-100 focus-within:shadow-lg"
      :class="{ 'bg-gray-50': modelValue.state === ExerciseState.DRAFT }"
    >
      <template v-slot:header>
        <div class="flex">
          <h3>
            {{ $t("exercise_editor.exercise_editor_title") }}
            <span
              v-if="modelValue.state === ExerciseState.DRAFT"
              class="text-muted"
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
        <div class="flex flex-col space-y-6">
          <div class="flex flex-col items-start my-4 space-x-8 md:flex-row">
            <div class="w-full mr-auto md:w-4/12">
              <TextInput
                :modelValue="modelValue.label"
                @update:modelValue="onBaseExerciseChange('label', $event)"
                >{{ $t("exercise_editor.exercise_label") }}</TextInput
              >
            </div>
            <div class="self-start w-1/2 mr-auto md:w-3/12">
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
            <div class="flex flex-col ml-auto md:flex-row md:w-5/12">
              <Dropdown
                class="w-full"
                :id="'exercise_type_' + elementId"
                :options="exerciseTypeOptions"
                :modelValue="modelValue.exercise_type"
                @update:modelValue="
                  onBaseExerciseChange('exercise_type', $event)
                "
              >
                {{ $t("exercise_editor.exercise_type") }}
              </Dropdown>
              <!--              :modelValue="modelValue.exercise_type"
              @update:modelValue="onExerciseTypeChange($event)"-->
            </div>
          </div>
          <TextEditor
            :modelValue="modelValue.text"
            @update:modelValue="onBaseExerciseChange('text', $event)"
            >{{ $t("exercise_editor.exercise_text") }}</TextEditor
          >
          <TextEditor
            v-if="modelValue.exercise_type !== ExerciseType.JS"
            :modelValue="modelValue.solution"
            @update:modelValue="onBaseExerciseChange('solution', $event)"
            >{{ $t("exercise_editor.exercise_solution") }}</TextEditor
          >
          <CodeEditor
            :modelValue="modelValue.solution"
            @update:modelValue="onBaseExerciseChange('solution', $event)"
            v-else
            >{{ $t("exercise_editor.exercise_solution") }}</CodeEditor
          >
          <TagInput
            :modelValue="modelValue.public_tags ?? []"
            :allow-edit-tags="false"
            :placeholder="$t('exercise_editor.exercise_public_tags')"
            @addTag="onAddTag($event, true)"
            @removeTag="onRemoveTag($event, true)"
          ></TagInput>

          <TagInput
            :modelValue="modelValue.private_tags ?? []"
            :allow-edit-tags="false"
            :placeholder="$t('exercise_editor.exercise_private_tags')"
            @addTag="onAddTag($event, false)"
            @removeTag="onRemoveTag($event, false)"
          ></TagInput>
        </div>
        <!-- Multiple-choice exercise types settings -->
        <div class="mt-8" v-if="isMultipleChoice">
          <h3 class="mb-8">{{ $t("exercise_editor.choices_title") }}</h3>
          <draggable
            :modelValue="modelValue.choices"
            @end="onChoiceDragEnd($event)"
            ghost-class="drag-ghost"
            item-key="id"
          >
            <template #item="{ element }">
              <ChoiceEditor
                :modelValue="element"
                @choiceUpdate="
                  onUpdateChoice(element.id, $event.field, $event.value)
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

        <!-- Aggregated exercise settings -->

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
                @testCaseUpdate="
                  onUpdateTestCase(element.id, $event.field, $event.value)
                "
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

import { createNamespacedHelpers } from "vuex";
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
} from "@/const";
import CodeEditor from "@/components/ui/CodeEditor.vue";
import TestCaseEditor from "./TestCaseEditor.vue";
const { mapActions, mapMutations } = createNamespacedHelpers("teacher");

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
  },
  props: {
    modelValue: {
      type: Object as PropType<Exercise>,
      required: true,
    },
  },
  mixins: [courseIdMixin, savingMixin],
  created() {
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

    this.modelValue.choices?.forEach((c) =>
      this.instantiateChoiceAutoSaveManager(c)
    );
    this.modelValue.testcases?.forEach((t) =>
      this.instantiateTestCaseAutoSaveManager(t)
    );
  },
  data() {
    return {
      autoSaveManager: null as AutoSaveManager<Exercise> | null,
      choiceAutoSaveManagers: {} as Record<
        string,
        AutoSaveManager<ExerciseChoice>
      >,
      testCaseAutoSaveManagers: {} as Record<
        string,
        AutoSaveManager<ExerciseTestCase>
      >,
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
      exerciseTypeOptions,
      exerciseStateOptions,
      ExerciseState,
      ExerciseType,
    };
  },
  methods: {
    ...mapActions([
      "updateExercise",
      "addExerciseChoice",
      "addExerciseTestCase",
      "updateExerciseChoice",
      "addExerciseTag",
      "removeExerciseTag",
      "updateExerciseChild",
    ]),
    ...mapMutations(["setExercise", "setExerciseChoice", "setExerciseChild"]),
    async onChoiceDragEnd(event: { oldIndex: number; newIndex: number }) {
      const draggedChoice = (this.modelValue.choices as ExerciseChoice[])[
        event.oldIndex
      ];

      if (event.oldIndex !== event.newIndex) {
        await this.onUpdateChoice(
          draggedChoice.id,
          "_ordering",
          event.newIndex
        );
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
    // onExerciseTypeChange (newVal: ExerciseType) {
    //   if (!confirm('Are you sure?')) return
    //   this.modelValue.exercise_type = newVal
    // }

    async onAddChoice() {
      const newChoice: ExerciseChoice = await this.addExerciseChoice({
        courseId: this.courseId,
        exerciseId: this.modelValue.id,
        choice: getBlankChoice(),
      });
      this.instantiateChoiceAutoSaveManager(newChoice);
    },
    async onAddTestCase() {
      const newTestcase: ExerciseTestCase = await this.addExerciseTestCase({
        courseId: this.courseId,
        exerciseId: this.modelValue.id,
        testcase: getBlankTestCase(),
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
    async onUpdateChoice(
      choiceId: string,
      key: keyof ExerciseChoice,
      value: unknown
    ) {
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
      this.choiceAutoSaveManagers[choice.id] =
        new AutoSaveManager<ExerciseChoice>(
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
      this.testCaseAutoSaveManagers[testcase.id] =
        new AutoSaveManager<ExerciseTestCase>(
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
  },
});
</script>

<style></style>
