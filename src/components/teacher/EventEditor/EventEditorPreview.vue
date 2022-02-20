<template>
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
        <p class="mb-2 text-muted text-danger-dark" v-if="halfClosed">
          {{ $t('event_preview.still_open_for_some') }}
        </p>
        <div class="flex items-end mt-auto">
          <div class="flex mr-auto space-x-2">
            <router-link
              :to="{ name: 'ExamEditor', params: { examId: event.id } }"
              ><Btn v-if="hasPrivileges([CoursePrivilege.MANAGE_EVENTS])"
                ><span class="-ml-1 mr-1.5 text-base material-icons-outlined">
                  edit
                </span>
                {{ $t('event_preview.editor') }}</Btn
              ></router-link
            >
          </div>
          <Btn
            class="mr-1"
            :variant="'danger'"
            v-if="hasBegun && hasPrivileges([CoursePrivilege.MANAGE_EVENTS])"
            @click="$emit('close')"
            ><span class="mr-1 text-base material-icons-outlined"> block </span
            >{{ $t('event_preview.close') }}</Btn
          >
          <router-link
            v-if="hasBegun"
            :to="{ name: 'ExamProgress', params: { examId: event.id } }"
            ><Btn
              :outline="true"
              v-if="hasPrivileges([CoursePrivilege.MANAGE_EVENTS])"
              ><span class="mr-1.5 -ml-1 text-base material-icons-outlined">
                visibility </span
              >{{ $t('event_preview.monitor') }}</Btn
            ></router-link
          >
          <router-link
            :to="{ name: 'ExamResults', params: { examId: event.id } }"
            v-else-if="
              hasEnded && hasPrivileges([CoursePrivilege.ASSESS_PARTICIPATIONS])
            "
            ><Btn
              ><span class="mr-1.5 text-base material-icons-outlined">
                bar_chart
              </span>
              {{ $t('event_preview.results') }}</Btn
            ></router-link
          >
        </div>
      </div>
    </template>
  </Card>
</template>

<script lang="ts">
import { defineComponent } from '@vue/runtime-core'
import { PropType } from 'vue'
import { Event, EventState, CoursePrivilege } from '@/models'
import Card from '@/components/ui/Card.vue'
import Timestamp from '@/components/ui/Timestamp.vue'
import { getTranslatedString as _ } from '@/i18n'
import { icons as eventStatesIcons } from '@/assets/eventStateIcons'
import MultiIcon from '@/components/ui/MultiIcon.vue'
import Btn from '@/components/ui/Btn.vue'
import { coursePrivilegeMixin } from '@/mixins'

export default defineComponent({
  components: {
    Card,
    Timestamp,
    MultiIcon,
    Btn
  },
  name: 'EventEditorPreview',
  mixins: [coursePrivilegeMixin],
  props: {
    event: {
      type: Object as PropType<Event>,
      required: true
    }
  },
  data () {
    return {
      CoursePrivilege
    }
  },
  computed: {
    previewTitle (): string {
      return (this.event?.name ?? '').trim().length > 0
        ? (this.event.name as string)
        : _('event_preview.unnamed_event')
    },
    isDraft (): boolean {
      return this.event.state === EventState.DRAFT
    },
    eventStateIcons () {
      return eventStatesIcons[this.event.state as EventState]
    },
    hasBegun () {
      return (
        this.event.state === EventState.OPEN ||
        (this.event.state === EventState.CLOSED &&
          (this.event.users_allowed_past_closure?.length ?? 0) > 0)
      )
    },
    hasEnded () {
      return (
        this.event.state === EventState.CLOSED &&
        (this.event.users_allowed_past_closure?.length ?? -1) === 0
      )
    },
    halfClosed () {
      return (
        this.event.state === EventState.CLOSED &&
        (this.event.users_allowed_past_closure?.length ?? 0) > 0
      )
    }
  }
})
</script>

<style></style>
