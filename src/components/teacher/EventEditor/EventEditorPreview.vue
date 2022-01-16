<template>
  <router-link :to="{ name: 'EventEditor', params: { examId: event.id } }">
    <Card
      :marginLess="true"
      class="transition-all duration-75 hover:bg-light hover:shadow-md"
    >
      <template v-slot:header>
        <div class="flex items-center w-full">
          <h3>{{ previewTitle }}</h3>
        </div>
        <div class="flex ml-auto space-x-2">
          <timestamp :value="event.begin_timestamp"></timestamp>
          <timestamp :value="event.end_timestamp"></timestamp>
        </div>
      </template>
      <template v-slot:body> {{ event.instructions }} </template>
    </Card>
  </router-link>
</template>

<script lang="ts">
import { defineComponent } from '@vue/runtime-core'
import { PropType } from 'vue'
import { Event } from '@/models'
import Card from '@/components/ui/Card.vue'
import Timestamp from '@/components/ui/Timestamp.vue'
import { getTranslatedString as _ } from '@/i18n'

export default defineComponent({
  components: {
    Card,
    Timestamp
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
    }
  }
})
</script>

<style></style>
