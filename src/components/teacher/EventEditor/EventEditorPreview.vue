<template>
  <!-- <router-link :to="{ name: 'ExamEditor', params: { examId: event.id } }"> -->
  <Card
    :marginLess="true"
    class="transition-all duration-75 hover:bg-light"
    :class="{ 'bg-light': isDraft }"
  >
    <template v-slot:header>
      <div class="flex items-center w-full m2-4">
        <h3>{{ previewTitle }}</h3>
        <div class="w-40">
          <div class="my-auto ml-4 chip">
            <div class="flex items-center">
              <MultiIcon class="w-6" :icons="eventStateIcons"></MultiIcon>
              <p v-html="$t('event_states.' + event.state)"></p>
            </div>
          </div>
        </div>
      </div>
    </template>
    <template v-slot:body
      ><div class="flex flex-col h-full">
        <div
          v-if="event.instructions.length > 0"
          class="mb-2 overflow-hidden overflow-ellipsis"
          v-html="event.instructions"
        ></div>
        <div class="mt-1 mb-4 space-y-1 text-sm">
          <div class="flex space-x-1" v-if="event.begin_timestamp">
            <p class="text-muted">{{ $t('event_editor.begin_timestamp') }}:</p>
            <Timestamp :value="event.begin_timestamp"></Timestamp>
          </div>
          <div class="flex space-x-1" v-if="event.end_timestamp">
            <p class="text-muted">{{ $t('event_editor.end_timestamp') }}:</p>
            <Timestamp :value="event.end_timestamp"></Timestamp>
          </div>
        </div>
        <div class="flex items-end justify-between mt-auto">
          <router-link
            :to="{ name: 'ExamEditor', params: { examId: event.id } }"
            ><Btn>Editor</Btn></router-link
          >
          <Btn v-if="hasBegun">Monitora</Btn>
          <Btn v-else-if="hasEnded">Risultati</Btn>
        </div>
      </div>
    </template>
  </Card>
  <!-- </router-link> -->
</template>

<script lang="ts">
import { defineComponent } from '@vue/runtime-core'
import { PropType } from 'vue'
import { Event, EventState } from '@/models'
import Card from '@/components/ui/Card.vue'
import Timestamp from '@/components/ui/Timestamp.vue'
import { getTranslatedString as _ } from '@/i18n'
import { icons as eventStatesIcons } from '@/assets/eventStateIcons'
import MultiIcon from '@/components/ui/MultiIcon.vue'
import Btn from '@/components/ui/Btn.vue'

export default defineComponent({
  components: {
    Card,
    Timestamp,
    MultiIcon,
    Btn
  },
  name: 'EventEditorPreview',
  props: {
    event: {
      type: Object as PropType<Event>,
      required: true
    }
  },
  computed: {
    previewTitle (): string {
      return (this.event?.name ?? '').trim().length > 0
        ? (this.event.name as string)
        : _('event_preview.unnamed_event')
    },
    isDraft (): boolean {
      return this.event.state == EventState.DRAFT
    },
    eventStateIcons () {
      return eventStatesIcons[this.event.state as EventState]
    },
    hasBegun () {
      return true
    },
    hasEnded () {
      return true
    }
  }
})
</script>

<style></style>
