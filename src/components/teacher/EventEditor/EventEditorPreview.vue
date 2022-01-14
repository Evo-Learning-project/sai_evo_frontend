<template>
  <router-link :to="{ name: 'EventEditor', params: { id: event.id } }">
    <Card class="transition-all duration-75 hover:bg-light hover:shadow-md">
      <template v-slot:header>
        <div class="flex items-center w-full">
          <h3>{{ event.name }}</h3>
          <div class="flex ml-auto space-x-2">
            <timestamp :value="event.begin_timestamp"></timestamp>
            <timestamp :value="event.end_timestamp"></timestamp>
          </div>
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
  }
})
</script>

<style></style>
