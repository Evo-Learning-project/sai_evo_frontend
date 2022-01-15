<template>
  <!--<card>
    <template v-slot:header>-->
  <div
    class="px-3 py-4 rounded-md"
    :class="[rule.target_slot_number % 2 ? 'bg-light' : 'bg-gray-50']"
  >
    <div class="flex items-center ">
      <h4>
        {{ $t('event_template_rule_editor.exercise_number') }}
        {{ rule.target_slot_number + 1 }}
      </h4>
      <div class="flex ml-auto space-x-2">
        <btn @btnClick="showExerciseSelector()" :size="'sm'">
          {{
            isExerciseChosen
              ? $t('event_template_rule_editor.change_exercise')
              : $t('event_template_rule_editor.choose_exercise')
          }}
        </btn>
        <btn
          @btnClick="deleteRule()"
          :size="'sm'"
          :variant="'danger'"
          :outline="true"
          ><span class="text-base material-icons-outlined">
            delete
          </span>
        </btn>
      </div>
    </div>

    <exercise-preview
      v-if="isExerciseChosen"
      :exercise="rule.exercises[0]"
    ></exercise-preview>
  </div>
  <!--</template>
  </card>-->
</template>

<script lang="ts">
//import Card from '@/components/ui/Card.vue'
import ExercisePreview from '@/components/teacher/ExerciseEditor/ExercisePreview.vue'

import { EventTemplateRule, Exercise, getBlankExercise } from '@/models'
import { defineComponent, PropType } from '@vue/runtime-core'
import Btn from '@/components/ui/Btn.vue'

export default defineComponent({
  name: 'ExactRuleEventTemplateEditor',
  components: {
    //Card,
    ExercisePreview,
    Btn
  },
  props: {
    rule: {
      type: Object as PropType<EventTemplateRule>,
      required: true
    }
  },
  methods: {
    showExerciseSelector () {
      // eslint-disable-next-line vue/no-mutating-props
      this.rule?.exercises?.push(getBlankExercise())
    }
  },
  computed: {
    isExerciseChosen (): boolean {
      return !!(this.rule?.exercises as Exercise[])[0]
    }
  }
})
</script>

<style></style>
