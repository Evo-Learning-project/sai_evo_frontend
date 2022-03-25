<template>
  <Card :margin-less="true">
    <template v-slot:header>
      <div class="flex items-center w-full">
        <span class="material-icons-outlined text-lg -ml-0.5">person</span>
        <p class="text-muted ml-1.5">{{ user.full_name }}</p>
        <Btn
          class="ml-auto"
          :outline="true"
          :variant="'icon'"
          @click="expanded = !expanded"
          ><span class="material-icons-outlined">
            {{ expanded ? "expand_less" : "expand_more" }}
          </span></Btn
        >
      </div>
      <div class="flex items-center space-x-1.5">
        <span class="text-sm material-icons-outlined">mail</span>
        <p class="text-muted">{{ user.email }}</p>
      </div>
    </template>
    <template v-if="true || expanded" v-slot:body>
      <div
        class="duration-200 ease-in-out transition-max-height"
        :class="{
          'max-h-0 overflow-hidden': !expanded,
          'max-h-36': false && expanded && fetching,
          'max-h-96 overflow-y-auto': expanded && (true || !fetching),
        }"
      >
        <SkeletonCard :border-less="true" class="-ml-4" v-if="fetching"></SkeletonCard>
        <Timeline
          v-else
          :steps="processedHistory"
          v-slot="{ timestamp, eventType, data }"
        >
          <div class="text-sm text-muted">
            <Timestamp :value="timestamp"></Timestamp>
          </div>
          <div class="flex items-center space-x-1">
            <p>
              {{ $t("course_insights.user_history_event_descriptions." + eventType) }}
              <strong v-if="eventType === EventType.EXAM">{{ data.name }}</strong>
            </p>
            <router-link
              :to="{
                name: 'ExamParticipationFull',
                params: { examId: data.examId, participationId: data.id },
              }"
            >
              <Btn :outline="true" :variant="'icon'"
                ><span class="material-icons-outlined text-base">launch</span></Btn
              >
            </router-link>
          </div>
        </Timeline>
      </div>
    </template>
  </Card>
</template>

<script lang="ts">
import { EventParticipation, EventType, User } from "@/models";
import { defineComponent, PropType } from "@vue/runtime-core";
import Card from "../ui/Card.vue";
import Btn from "../ui/Btn.vue";
import Timeline from "../ui/Timeline.vue";
import Timestamp from "../ui/Timestamp.vue";
import { getUserCourseParticipations } from "@/api/courses";
import { courseIdMixin, loadingMixin } from "@/mixins";
import SkeletonCard from "../ui/SkeletonCard.vue";
export default defineComponent({
  name: "StudentCard",
  mixins: [courseIdMixin, loadingMixin],
  props: {
    user: {
      type: Object as PropType<User>,
      required: true,
    },
  },
  watch: {
    async expanded(newVal) {
      if (newVal && this.participationHistory.length === 0) {
        this.fetching = true;
        try {
          this.participationHistory = await getUserCourseParticipations(
            this.courseId,
            this.user.id
          );
        } catch (e) {
          this.setErrorNotification(e);
        } finally {
          this.fetching = false;
        }
      }
    },
  },
  data() {
    return {
      fetching: false,
      expanded: false,
      participationHistory: [] as EventParticipation[],
      EventType,
    };
  },
  methods: {},
  computed: {
    processedHistory() {
      return this.participationHistory.map((p) => ({
        eventType: p.event.event_type,
        timestamp: p.begin_timestamp,
        data: {
          id: p.id,
          name: p.event.name,
          examId: p.event.id,
          class:
            p.event.event_type === EventType.SELF_SERVICE_PRACTICE ? "opacity-50" : "",
        },
      }));
    },
  },
  components: { Card, Btn, Timeline, Timestamp, SkeletonCard },
});
</script>

<style></style>
