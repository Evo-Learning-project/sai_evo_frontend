<template>
  <div>
    <div class="flex mt-6 mb-6 space-x-4">
      <text-input
        class="w-1/2 mr-auto"
        :modelValue="modelValue.name"
        @update:modelValue="emitUpdate('name', $event)"
        >{{ $t('event_editor.name') }}</text-input
      >
      <calendar-input
        class=""
        :modelValue="modelValue.begin_timestamp"
        @update:modelValue="emitUpdate('begin_timestamp', $event)"
        >{{ $t('event_editor.begin_timestamp') }}</calendar-input
      >
      <calendar-input
        class=""
        :modelValue="modelValue.end_timestamp"
        @update:modelValue="emitUpdate('end_timestamp', $event)"
        >{{ $t('event_editor.end_timestamp') }}</calendar-input
      >
    </div>
    <text-editor
      :modelValue="modelValue.instructions"
      @update:modelValue="emitUpdate('instructions', $event)"
    >
      {{ $t('event_editor.instructions') }}</text-editor
    >
    <div class="flex flex-col mt-12 space-y-4">
      <div class="flex items-center space-x-4">
        <number-input
          class="w-1/3"
          :modelValue="modelValue.exercises_shown_at_a_time"
          @update:modelValue="emitUpdate('exercises_shown_at_a_time', $event)"
          >{{
            $t('event_editor.exercises_shown_at_a_time_label')
          }}</number-input
        >
        <p class="select-none text-muted">{{ $t('misc.or_label') }}</p>
        <btn>{{ $t('event_editor.show_all_exercises_at_once') }}</btn>
      </div>
      <toggle
        :labelOnLeft="true"
        class=""
        :modelValue="modelValue.allow_going_back"
        @update:modelValue="emitUpdate('allow_going_back', $event)"
        >{{ $t('event_editor.allow_going_back_label') }}</toggle
      >
    </div>
  </div>
</template>

<script lang="ts">
import CalendarInput from '@/components/ui/CalendarInput.vue'
import TextInput from '@/components/ui/TextInput.vue'
import TextEditor from '@/components/ui/TextEditor.vue'
import { defineComponent } from '@vue/runtime-core'
import { Event } from '@/models'
import Toggle from '@/components/ui/Toggle.vue'
import NumberInput from '@/components/ui/NumberInput.vue'
import { PropType } from 'vue'
import Btn from '@/components/ui/Btn.vue'

export default defineComponent({
  name: 'EventMetaEditor',
  components: {
    CalendarInput,
    TextInput,
    TextEditor,
    Toggle,
    NumberInput,
    Btn
  },
  props: {
    modelValue: {
      type: Object as PropType<Event>,
      required: true
    }
  },
  // created () {
  //   this.event = this.modelValue
  // },
  // watch: {
  //   serializedModelValue (newVal: string) {
  //     this.$emit('update:modelValue', JSON.parse(newVal))
  //   }
  // },
  data () {
    return {
      event: {} as Event,
      saving: false
    }
  },
  methods: {
    emitUpdate (key: keyof Event, value: unknown) {
      console.log(key, value)
      this.$emit('update:modelValue', {
        ...this.modelValue,
        [key]: value
      })
    }
  },
  computed: {
    // serializedEvent () {
    //   return JSON.stringify(this.event)
    // }
  }
})
</script>

<style></style>
