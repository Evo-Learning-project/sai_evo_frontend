<template>
  <div>
    <h3 class="mb-3">{{ $t('event_editor.state_editor_title') }}</h3>
    <div class="flex space-x-2">
      <p class="mt-2 text-muted">{{ $t('event_editor.current_state_is') }}</p>
      <Dropdown
        :modelValue="modelValue.state"
        @update:modelValue="emitUpdate('state', $event)"
        :options="eventStateOptions"
      >
        <!-- {{ $t('event_editor.state') }}-->
      </Dropdown>
      <!-- 
          don't use a dropdown, use a button to publish it or revert to draft mode
      -->
    </div>
  </div>
</template>

<script lang="ts">
import { Event, EventState } from '@/models'
import { defineComponent, PropType } from '@vue/runtime-core'
import { icons as eventStateIcons } from '@/assets/eventStateIcons'
import { getTranslatedString as _ } from '@/i18n'
import Dropdown from '@/components/ui/Dropdown.vue'

export default defineComponent({
  components: { Dropdown },
  props: {
    modelValue: {
      type: Object as PropType<Event>,
      required: true
    }
  },
  name: 'EventStateEditor',
  methods: {
    emitUpdate (key: keyof Event, value: unknown) {
      this.$emit('update:modelValue', {
        ...this.modelValue,
        [key]: value
      })
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
    }
  }
})
</script>

<style></style>
