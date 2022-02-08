<template>
  <div class="relative">
    <div
      @click="onFocusNonDraft"
      style="z-index: 20"
      class="absolute top-0 left-0 w-full h-full bg-gray-500 bg-opacity-0 cursor-pointer"
      v-if="!isDraft && preventEdit"
    ></div>
    <Card
      :marginLess="true"
      class="transition-shadow duration-100 focus-within:shadow-lg"
      :class="{ 'bg-gray-50': isDraft }"
    >
      <template v-slot:header>
        <div class="flex">
          <h3>
            {{ $t('exercise_editor.exercise_editor_title') }}
            <span v-if="isDraft" class="text-muted"
              >({{ $t('exercise_editor.draft_notice') }})</span
            >
          </h3>
          <CloudSaveStatus
            class="my-auto ml-auto mr-8"
            :saving="saving"
          ></CloudSaveStatus>
        </div>
      </template>
      <template v-slot:body>
        <div class="flex flex-col space-y-6">
          <div class="flex flex-col items-start my-4 space-x-8 md:flex-row">
            <div class="w-full mr-auto md:w-4/12">
              <text-input
                :modelValue="modelValue.label"
                @update:modelValue="emitUpdate('label', $event)"
                >{{ $t('exercise_editor.exercise_label') }}</text-input
              >
            </div>
            <div class="self-start w-1/2 mr-auto md:w-3/12">
              <Dropdown
                :id="'exercise_state_' + elementId"
                :options="exerciseStateOptions"
                :modelValue="modelValue.state"
                @update:modelValue="onExerciseStateChange($event)"
              >
                <!--emitUpdate('state', $event)-->
                {{ $t('exercise_editor.exercise_state') }}
              </Dropdown>
            </div>
            <div class="flex flex-col ml-auto md:flex-row md:w-5/12">
              <Dropdown
                class="w-full"
                :id="'exercise_type_' + elementId"
                :options="exerciseTypeOptions"
                :modelValue="modelValue.exercise_type"
                @update:modelValue="emitUpdate('exercise_type', $event)"
              >
                {{ $t('exercise_editor.exercise_type') }}
              </Dropdown>
              <!--              :modelValue="modelValue.exercise_type"
              @update:modelValue="onExerciseTypeChange($event)"-->
            </div>
          </div>
          <text-editor
            :modelValue="modelValue.text"
            @update:modelValue="emitUpdate('text', $event)"
            >{{ $t('exercise_editor.exercise_text') }}</text-editor
          >
          <!-- TODO show code editor if the exercise type is js -->
          <text-editor
            :modelValue="modelValue.solution"
            @update:modelValue="emitUpdate('solution', $event)"
            >{{ $t('exercise_editor.exercise_solution') }}</text-editor
          >
          <TagInput
            :modelValue="modelValue.tags"
            :allow-edit-tags="true"
            :placeholder="$t('exercise_editor.exercise_tags')"
            @addTag="onAddTag($event)"
            @removeTag="onRemoveTag($event)"
          ></TagInput>
          <!-- @update:modelValue="emitUpdate('tags', $event)"-->
        </div>
        <!-- Multiple-choice exercise types settings -->
        <div class="mt-8" v-if="isMultipleChoice">
          <h3 class="mb-8">{{ $t('exercise_editor.choices_title') }}</h3>
          <choice-editor
            v-for="(choice, index) in modelValue.choices"
            :key="elementId + '-choice-' + index"
            :modelValue="modelValue.choices[index]"
            @update:modelValue="onChoiceUpdate(index, $event)"
          ></choice-editor>
          <!--v-model="modelValue.choices[index]"-->
          <btn @btnClick="onAddChoice()" :size="'sm'"
            ><span class="mr-1 text-base material-icons-outlined">
              add_circle_outline
            </span>
            {{ $t('exercise_editor.new_choice') }}</btn
          >
          <!-- Js exercise settings -->

          <!-- Completion exercise settings -->

          <!-- Aggregated exercise settings -->
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
import { getTranslatedString as _ } from '@/i18n'
import { icons as exerciseTypesIcons } from '@/assets/exerciseTypesIcons'
import { icons as exerciseStatesIcons } from '@/assets/exerciseStatesIcons'
import { v4 as uuid4 } from 'uuid'
import Dropdown from '@/components/ui/Dropdown.vue'
import Dialog from '@/components/ui/Dialog.vue'

import {
  getBlankChoice,
  Exercise,
  ExerciseState,
  ExerciseChoice,
  getExerciseValidationErrors
} from '@/models'
import { ExerciseType, multipleChoiceExerciseTypes } from '@/models'
import Card from '@/components/ui/Card.vue'
//import Dropdown from '@/components/ui/Dropdown.vue'
import { defineComponent, PropType } from '@vue/runtime-core'
import TextEditor from '@/components/ui/TextEditor.vue'
import TextInput from '@/components/ui/TextInput.vue'
import Btn from '@/components/ui/Btn.vue'
import TagInput from '@/components/ui/TagInput.vue'

import ChoiceEditor from '@/components/teacher/ExerciseEditor/ChoiceEditor.vue'
import CloudSaveStatus from '@/components/ui/CloudSaveStatus.vue'
import { getDebouncedForEditor } from '@/utils'
import { courseIdMixin } from '@/mixins'
import { DialogData } from '@/interfaces'

export default defineComponent({
  name: 'ExerciseEditor',
  components: {
    Card,
    TextEditor,
    TextInput,
    Dropdown,
    ChoiceEditor,
    Btn,
    TagInput,
    CloudSaveStatus,
    Dialog
  },
  props: {
    modelValue: {
      type: Object as PropType<Exercise>,
      required: true
    }
  },
  mixins: [courseIdMixin],
  watch: {
    async serializedBaseExerciseFields (newVal: string, oldVal: string) {
      if (oldVal !== '{}' && newVal !== oldVal) {
        await this.onBaseFieldsChange(JSON.parse(newVal) as Exercise)
      }
    }
  },
  created () {
    this.elementId = uuid4()
    this.dispatchExerciseUpdate = getDebouncedForEditor(
      this.dispatchExerciseUpdate
    )
    this.dispatchChoiceUpdate = getDebouncedForEditor(this.dispatchChoiceUpdate)
  },
  data () {
    return {
      elementId: '',
      showSaved: false,
      saving: false,
      showDialog: false,
      showValidationErrors: false,
      preventEdit: true,
      dialogData: {
        title: '',
        text: '',
        onNo: null as null | (() => void),
        onYes: null as null | (() => void),
        error: false,
        confirmOnly: false
      } as DialogData
    }
  },
  methods: {
    emitUpdate (key: keyof Exercise, value: unknown) {
      this.$emit('update:modelValue', {
        ...this.modelValue,
        [key]: value
      })
    },
    onFocusNonDraft () {
      this.showDialog = true
      this.dialogData = {
        title: _('exercise_editor.edit_non_draft_title'),
        text: _('exercise_editor.edit_non_draft_body'),
        yesText: _('misc.edit'),
        noText: _('dialog.default_cancel_text'),
        onNo: () => (this.showDialog = false),
        onYes: () => {
          this.preventEdit = false
          this.showDialog = false
        }
      }
    },
    // onExerciseTypeChange (newVal: ExerciseType) {
    //   if (!confirm('Are you sure?')) return
    //   this.modelValue.exercise_type = newVal
    // }

    // event handlers
    async onBaseFieldsChange (newVal: Exercise) {
      this.saving = true
      await this.dispatchExerciseUpdate(newVal)
    },
    async onAddChoice () {
      await this.$store.dispatch('addExerciseChoice', {
        courseId: this.courseId,
        exerciseId: this.modelValue.id,
        choice: getBlankChoice()
      })
    },
    async onAddTag (tag: string) {
      await this.$store.dispatch('addExerciseTag', {
        courseId: this.courseId,
        exerciseId: this.modelValue.id,
        tag
      })
    },
    async onRemoveTag (tag: string) {
      await this.$store.dispatch('removeExerciseTag', {
        courseId: this.courseId,
        exerciseId: this.modelValue.id,
        tag
      })
    },
    async onChoiceUpdate (index: number, newVal: ExerciseChoice) {
      // eslint-disable-next-line @typescript-eslint/no-extra-semi
      ;(this.modelValue.choices as ExerciseChoice[])[index] = newVal // TODO use a mutation
      this.saving = true
      await this.dispatchChoiceUpdate(newVal)
    },
    onExerciseStateChange (newState: ExerciseState) {
      if (newState != ExerciseState.DRAFT && this.validationErrors.length > 0) {
        this.showDialog = true
        this.showValidationErrors = true
        this.dialogData = {
          title: _('exercise_editor.cannot_publish'),
          text: _('exercise_editor.cannot_publish_body'),
          onYes: () => {
            this.showDialog = false
            this.showValidationErrors = false
          },
          error: true,
          confirmOnly: true
        }
        return
      }
      if (newState == ExerciseState.PUBLIC) {
        this.showDialog = true
        this.dialogData = {
          title: _('exercise_editor.make_public_confirmation_title'),
          text: _('exercise_editor.make_public_confirmation_body'),
          onYes: () => {
            this.emitUpdate('state', newState)
            this.showDialog = false
          },
          onNo: () => (this.showDialog = false),
          error: false,
          confirmOnly: false
        }
      } else {
        this.emitUpdate('state', newState)
      }
    },
    // end event handlers

    // debounced dispatchers
    async dispatchExerciseUpdate (newVal: Exercise) {
      await this.$store.dispatch('updateExercise', {
        courseId: this.courseId,
        exercise: newVal
      })
      this.saving = false
    },
    async dispatchChoiceUpdate (newVal: ExerciseChoice) {
      await this.$store.dispatch('updateExerciseChoice', {
        courseId: this.courseId,
        exerciseId: this.modelValue.id,
        choice: newVal
      })
      this.saving = false
    }
    // end debounced dispatchers
  },
  computed: {
    serializedExercise () {
      return JSON.stringify(this.modelValue)
    },
    serializedBaseExerciseFields () {
      const {
        id,
        text,
        exercise_type,
        solution,
        state,
        label
      } = this.modelValue
      return JSON.stringify({ id, text, exercise_type, solution, state, label })
    },
    exerciseTypeOptions () {
      return ((Object.keys(ExerciseType) as unknown[]) as ExerciseType[])
        .filter((key: string | number) => parseInt(key as string) == key) //(ExerciseType[key] as unknown) == 'number')
        .map(key => ({
          icons: exerciseTypesIcons[key],
          value: key,
          content: _('exercise_types.' + key)
        }))
    },
    exerciseStateOptions () {
      return ((Object.keys(ExerciseState) as unknown[]) as ExerciseState[])
        .filter((key: string | number) => parseInt(key as string) == key) //(ExerciseType[key] as unknown) == 'number')
        .map(key => ({
          icons: exerciseStatesIcons[key],
          value: key,
          content: _('exercise_states.' + key),
          description: _('exercise_states_descriptions.' + key)
        }))
    },
    isMultipleChoice (): boolean {
      return multipleChoiceExerciseTypes.includes(
        parseInt((this.modelValue.exercise_type?.toString() ?? '') as string)
      )
    },
    isDraft (): boolean {
      return this.modelValue.state == ExerciseState.DRAFT
    },
    validationErrors () {
      return getExerciseValidationErrors(this.modelValue).map(e =>
        _('exercise_validation_errors.' + e)
      )
    }
  }
})
</script>

<style></style>
