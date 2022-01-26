<template>
  <div class="">
    <h3 class="mb-3">{{ $t('event_editor.state_editor_title') }}</h3>
    <card class="bg-light">
      <template v-slot:header
        ><div class="flex space-x-4 items-center">
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
      </template></card
    >
    <div class="">
      <div class="flex space-x-4 items-center mt-2">
        <p class="text-muted">
          {{ $t('event_editor.current_state_is') }}
          <strong>{{ currentEventStateName }}</strong
          >.
        </p>
        <Btn
          :variant="'primary'"
          :loading="saving"
          @click="isDraft ? publish() : revertToDraft()"
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
        <strong>{{ formattedTimestamp }}</strong
        >.
      </p>
      <!-- TODO
         check that the exam can be published (non-null begin date, name etc.)
      -->
    </div>
  </div>
</template>

<script lang="ts">
import { Event, EventState } from '@/models'
import { defineComponent, PropType } from '@vue/runtime-core'
import { icons as eventStateIcons } from '@/assets/eventStateIcons'
import { getTranslatedString as _ } from '@/i18n'
import Card from '@/components/ui/Card.vue'
import Btn from '@/components/ui/Btn.vue'
import { getFormattedTimestamp } from '@/utils'
//import Dropdown from '@/components/ui/Dropdown.vue'

export default defineComponent({
  components: {
    Card,
    Btn
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
    }
  }
})
</script>

<style></style>
