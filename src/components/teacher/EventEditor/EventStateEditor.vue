<template>
  <div class="">
    <h3 class="mb-3">{{ $t('event_editor.state_editor_title') }}</h3>
    <Card class="bg-light" v-if="isDraft || isPlanned">
      <template v-slot:header
        ><div class="flex items-center space-x-4">
          <div v-if="isDraft">
            <div class="text-yellow-900 bg-yellow-500 icon-surrounding">
              <span class="ml-px material-icons-outlined">
                priority_high
              </span>
            </div>
          </div>
          <div v-else-if="isPlanned">
            <div class="icon-surrounding bg-success-light text-success-dark">
              <span class="material-icons-outlined">
                check
              </span>
            </div>
          </div>
          <p class="">{{ currentEventStateDescription }}</p>
        </div>
      </template></Card
    >
    <div class="">
      <div v-if="validationErrors.length > 0" class="mb-12">
        <p>{{ $t('event_editor.correct_errors_to_publish') }}</p>
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
      <div class="flex items-center mt-2 space-x-4">
        <p class="text-muted">
          {{
            isDraft || isPlanned
              ? $t('event_editor.current_state_is')
              : $t('event_editor.state_is')
          }}
          <strong>{{ currentEventStateName }}</strong
          >.
        </p>
        <Btn
          v-if="isDraft || isPlanned"
          :variant="'primary'"
          :disabled="isDraft && validationErrors.length > 0"
          :loading="saving"
          @btnClick="isDraft ? publish() : revertToDraft()"
        >
          {{
            isDraft
              ? $t('event_editor.publish')
              : $t('event_editor.revert_to_draft')
          }}
        </Btn>
      </div>
      <p v-if="isPlanned" class="mt-4 text-muted">
        {{ $t('event_editor.event_planned_help_text') }}
        <!-- <strong>{{ formattedTimestamp }}</strong> -->
        &nbsp;<strong
          ><Timestamp :value="modelValue.begin_timestamp"></Timestamp></strong
        >.
      </p>
      <!-- TODO
         check that the exam can be published (non-null begin date, name etc.)
      -->
    </div>
  </div>
</template>

<script lang="ts">
import { Event, EventState, getExamValidationErrors } from '@/models'
import { defineComponent, PropType } from '@vue/runtime-core'
import { icons as eventStateIcons } from '@/assets/eventStateIcons'
import { getTranslatedString as _ } from '@/i18n'
import Card from '@/components/ui/Card.vue'
import Btn from '@/components/ui/Btn.vue'
import { getFormattedTimestamp } from '@/utils'
import Timestamp from '@/components/ui/Timestamp.vue'
//import Dropdown from '@/components/ui/Dropdown.vue'

export default defineComponent({
  components: {
    Card,
    Btn,
    Timestamp
  },
  props: {
    modelValue: {
      type: Object as PropType<Event>,
      required: true
    },
    saving: {
      type: Boolean,
      required: true
    }
  },
  name: 'EventStateEditor',
  methods: {
    emitUpdate (value: EventState) {
      this.$emit('update:modelValue', value)
    },
    publish () {
      this.emitUpdate(EventState.PLANNED)
    },
    revertToDraft () {
      this.emitUpdate(EventState.DRAFT)
    }
  },
  computed: {
    eventStateOptions () {
      return ((Object.keys(EventState) as unknown[]) as EventState[])
        .filter((key: string | number) => parseInt(key as string) == key) //(ExerciseType[key] as unknown) == 'number')
        .map(key => ({
          icons: eventStateIcons[key],
          value: key,
          content: _('event_states.' + key),
          description: _('event_states_descriptions.' + key)
        }))
    },
    isDraft () {
      return this.modelValue.state == EventState.DRAFT
    },
    isPlanned () {
      return this.modelValue.state == EventState.PLANNED
    },
    currentEventStateName () {
      return this.eventStateOptions[
        this.modelValue?.state
      ]?.content?.toLowerCase()
    },
    currentEventStateDescription () {
      return this.eventStateOptions[this.modelValue?.state]?.description
    },
    formattedTimestamp () {
      return getFormattedTimestamp(this.modelValue.begin_timestamp ?? '')
    },
    validationErrors () {
      if (!this.modelValue) {
        return []
      }
      return getExamValidationErrors(this.modelValue).map(e =>
        _('exam_validation_errors.' + e)
      )
    }
  }
})
</script>

<style></style>
