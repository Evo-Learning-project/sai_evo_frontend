<template>
  <div>
    <div
      class="px-3 py-4 rounded-md"
      :class="[modelValue.target_slot_number % 2 ? 'bg-light' : 'bg-gray-50']"
    >
      <div class="flex items-center ">
        <h4>
          {{ $t('event_template_rule_editor.exercise_number') }}
          {{ modelValue.target_slot_number + 1 }}
        </h4>
        <div class="flex ml-auto space-x-2">
          <btn @click="showRuleDialog()" :size="'sm'">
            {{
              /*isExerciseChosen
                ? $t('event_template_rule_editor.change_exercise')
                : */
              $t('event_template_rule_editor.choose_exercise')
            }}
          </btn>
          <btn
            @click="deleteRule()"
            :size="'sm'"
            :variant="'danger'"
            :outline="true"
            ><span class="text-base material-icons-outlined">
              delete
            </span>
          </btn>
        </div>
      </div>

      <!-- <exercise-preview
        v-if="isExerciseChosen"
        :exercise="modelValue.exercises[0]"
      ></exercise-preview> -->
    </div>
    <Dialog :showDialog="showDialog" :large="true" :footerBorder="true">
      <template v-slot:title>
        {{
          $t('event_template_rule_editor.populate_slot_title') +
            ' ' +
            (modelValue.target_slot_number + 1)
        }}
      </template>
      <template v-slot:body>
        <div v-if="modelValue.rule_type == null">
          <p>{{ $t('event_template_rule_editor.mode_selection_text') }}</p>
          <div class="grid grid-cols-3 mt-6">
            <btn
              @click="setRuleMode(idBasedRuleType, true)"
              :variant="'transparent'"
              class="py-5 pl-4 border-r"
            >
              <template v-slot:content>
                <h4 class="text-dark">
                  {{ $t('event_template_rule_editor.pick_single_exercise') }}
                </h4>
                <p>
                  {{
                    $t(
                      'event_template_rule_editor.pick_single_exercise_help_text'
                    )
                  }}
                </p></template
              >
            </btn>
            <btn
              @click="setRuleMode(idBasedRuleType, false)"
              :variant="'transparent'"
              class="pl-8 border-r"
            >
              <template v-slot:content>
                <h4 class="text-dark">
                  {{ $t('event_template_rule_editor.pick_exercise_from_pool') }}
                </h4>
                <p>
                  {{
                    $t(
                      'event_template_rule_editor.pick_exercise_from_pool_help_text'
                    )
                  }}
                </p></template
              >
            </btn>
            <btn
              @click="setRuleMode(tagBasedRuleType)"
              :variant="'transparent'"
              class="pl-8"
            >
              <template v-slot:content>
                <h4 class="text-dark">
                  {{ $t('event_template_rule_editor.pick_exercise_tag_based') }}
                </h4>
                <p>
                  {{
                    $t(
                      'event_template_rule_editor.pick_exercise_tag_based_help_text'
                    )
                  }}
                </p>
              </template>
            </btn>
          </div>
        </div>
        <div v-else-if="modelValue.rule_type == idBasedRuleType">
          <h3 class="text-dark">
            {{
              pickOneExerciseOnly
                ? $t('event_template_rule_editor.pick_single_exercise')
                : $t('event_template_rule_editor.pick_exercise_from_pool')
            }}
          </h3>
          <p>
            {{
              pickOneExerciseOnly
                ? $t(
                    'event_template_rule_editor.pick_single_exercise_help_text'
                  )
                : $t(
                    'event_template_rule_editor.pick_exercise_from_pool_help_text'
                  )
            }}
          </p>
          <div class="mt-4 max-h-96">
            <exercise-picker
              :modelValue="modelValue.exercises"
              @addExercise="onAddExercise($event)"
              @removeExercise="onRemoveExercise($event)"
            ></exercise-picker>
          </div>
        </div>
        <div v-else-if="modelValue.rule_type == tagBasedRuleType"></div>
      </template>
    </Dialog>
  </div>
</template>

<script lang="ts">
import Dialog from '@/components/ui/Dialog.vue'
import { EventTemplateRule, EventTemplateRuleType, Exercise } from '@/models'
import { defineComponent, PropType } from '@vue/runtime-core'
import Btn from '@/components/ui/Btn.vue'
//import ExercisePreview from '@/components/teacher/ExerciseEditor/ExercisePreview.vue'
import ExercisePicker from '@/components/teacher/ExercisePicker.vue'
export default defineComponent({
  components: {
    Dialog,
    Btn,
    // ExercisePreview,
    ExercisePicker
  },
  name: 'EventTemplateRuleEditor',
  props: {
    modelValue: {
      type: Object as PropType<EventTemplateRule>
    }
  },
  data () {
    return {
      showDialog: false,
      pickOneExerciseOnly: null as boolean | null
    }
  },
  methods: {
    emitUpdate (key: keyof EventTemplateRule, value: unknown) {
      //console.log('key', key, 'value', value)
      this.$emit('update:modelValue', {
        ...this.modelValue,
        [key]: value
      })
    },
    onAddExercise (exercise: Exercise) {
      if (this.pickOneExerciseOnly) {
        this.emitUpdate('exercises', [exercise])
      } else {
        this.emitUpdate('exercises', [
          exercise,
          ...(this.modelValue?.exercises as Exercise[])
        ])
      }
    },
    onRemoveExercise (exercise: Exercise) {
      const index = (this.modelValue?.exercises as Exercise[]).findIndex(
        e => e.id === exercise.id
      )
      const newValue = [...(this.modelValue?.exercises as Exercise[])]
      newValue.splice(index, 1)
      this.emitUpdate('exercises', newValue)
    },
    showRuleDialog () {
      this.showDialog = true
    },
    setRuleMode (ruleType: EventTemplateRuleType, pickOne = false) {
      console.log(ruleType, pickOne)
      this.emitUpdate('rule_type', ruleType)
      this.pickOneExerciseOnly = pickOne
    }
  },
  computed: {
    // ruleTypes (): EventTemplateRuleType[] {
    //   return (Object.keys(
    //     EventTemplateRuleType
    //   ) as unknown[]) as EventTemplateRuleType[]
    // },
    idBasedRuleType (): EventTemplateRuleType {
      return EventTemplateRuleType.ID_BASED
    },
    tagBasedRuleType (): EventTemplateRuleType {
      return EventTemplateRuleType.TAG_BASED
    }
  }
})
</script>

<style></style>
