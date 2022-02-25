<template>
  <div>
    <Card :hoverable="false" :filled="true">
      <template v-slot:header>
        <h3>Impostazioni corso</h3>
      </template>
      <template v-slot:body>
        <div class="flex flex-col mt-2 space-y-6">
          <div class="flex justify-between">
            <div>
              <div class="flex items-center" v-show="!editingName">
                <p class="mr-2 text-muted">Nome</p>
                <p class="mr-3">{{ currentCourse.name }}</p>
                <Btn
                  v-if="hasPrivileges([CoursePrivilege.UPDATE_COURSE])"
                  :outline="true"
                  :variant="'icon'"
                  @click="editCourseName"
                >
                  <span class="text-xl material-icons-outlined">
                    edit
                  </span>
                </Btn>
              </div>
              <div v-show="editingName" class="flex items-center">
                <TextInput class="mr-2 w-96" v-model="dirtyCourseName"
                  >Nome del corso</TextInput
                >
                <Btn :outline="true" :variant="'icon'" @click="onDoneEditing()">
                  <span class="text-xl text-primary material-icons-outlined">
                    save
                  </span>
                </Btn>
                <Btn
                  :outline="true"
                  class=""
                  :variant="'icon'"
                  @click="onDoneEditing(true)"
                >
                  <span
                    class="text-xl text-danger-dark material-icons-outlined"
                  >
                    close
                  </span>
                </Btn>
              </div>
            </div>

            <div>
              <Toggle
                :disabled="!hasPrivileges([CoursePrivilege.UPDATE_COURSE])"
                :modelValue="currentCourse.hidden"
              >
                {{ $t('course_creation_form.hide_course') }}
              </Toggle>
              <p class="text-muted" v-if="currentCourse.hidden">
                {{ $t('course_creation_form.hidden_description') }}
              </p>
              <p class="text-muted" v-else>
                {{ $t('course_creation_form.public_description') }}
              </p>
            </div>
          </div>
          <div class="flex items-center" v-show="!editingDescription">
            <p class="mr-2 text-muted">Descrizione</p>
            <p class="mr-3">{{ currentCourse.description }}</p>
            <Btn
              v-if="hasPrivileges([CoursePrivilege.UPDATE_COURSE])"
              :outline="true"
              :variant="'icon'"
              @click="editCourseDescription"
            >
              <span class="text-xl material-icons-outlined">
                edit
              </span>
            </Btn>
          </div>
          <div v-show="editingDescription" class="flex items-center">
            <TextEditor class="w-2/3 mr-2" v-model="dirtyCourseDescription"
              >Descrizione del corso (opzionale)</TextEditor
            >
            <Btn :outline="true" :variant="'icon'" @click="onDoneEditing()">
              <span class="text-xl text-primary material-icons-outlined">
                save
              </span>
            </Btn>
            <Btn
              :outline="true"
              class=""
              :variant="'icon'"
              @click="onDoneEditing(true)"
            >
              <span class="text-xl text-danger-dark material-icons-outlined">
                close
              </span>
            </Btn>
          </div>
        </div>
      </template>
    </Card>
    <div class="mt-8">
      <h3>{{ $t('teacher_course_dashboard.recent_exams') }}</h3>
      <div>
        <div
          v-if="!firstLoading"
          class="grid grid-cols-1 gap-4 mt-4 lg:grid-cols-2 xl:grid-cols-3"
        >
          <EventEditorPreview
            v-for="(exam, index) in recentExams"
            :key="exam + '-' + index"
            :event="exam"
            :buttonIconsOnly="true"
          ></EventEditorPreview>
        </div>
        <div
          class="grid grid-cols-1 gap-4 mt-4 lg:grid-cols-2 xl:grid-cols-3"
          v-else
        >
          <EventEditorPreviewSkeleton></EventEditorPreviewSkeleton>
          <EventEditorPreviewSkeleton></EventEditorPreviewSkeleton>
          <EventEditorPreviewSkeleton></EventEditorPreviewSkeleton>
        </div>
        <div
          class="flex flex-col w-full mt-6 mb-16 -ml-5 text-center select-none"
          v-if="!firstLoading && exams.length === 0"
        >
          <p style="font-size: 6rem" class="material-icons-outlined opacity-10">
            assignment
          </p>
          <h2 class="opacity-40">{{ $t('course_events.no_exams') }}</h2>
        </div>
        <div v-else-if="!firstLoading" class="flex w-full mt-4">
          <router-link class="mx-auto link" :to="{ name: 'CourseExams' }"
            ><Btn :variant="'primary-borderless'">{{
              $t('teacher_course_dashboard.see_all')
            }}</Btn></router-link
          >
        </div>
      </div>
    </div>
    <div class="mt-8">
      <h3>{{ $t('teacher_course_dashboard.recently_edited_exercises') }}</h3>
      <div
        v-if="!firstLoading"
        class="grid grid-cols-1 gap-4 mt-4 lg:grid-cols-2"
      >
        <MinimalExercisePreview
          v-for="exercise in recentExercises"
          :key="'e-' + exercise.id"
          :exercise="exercise"
          :selectable="false"
        ></MinimalExercisePreview>
      </div>
      <div v-else class="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <MinimalExercisePreviewSkeleton></MinimalExercisePreviewSkeleton>
        <MinimalExercisePreviewSkeleton></MinimalExercisePreviewSkeleton>
        <MinimalExercisePreviewSkeleton></MinimalExercisePreviewSkeleton>
        <MinimalExercisePreviewSkeleton></MinimalExercisePreviewSkeleton>
      </div>
      <div
        class="flex flex-col w-full mt-6 -ml-5 text-center select-none mb-14"
        v-if="!firstLoading && exercises.length === 0"
      >
        <p style="font-size: 6rem" class="material-icons-outlined opacity-10">
          topic
        </p>
        <h2 class="opacity-40">{{ $t('course_exercises.no_exercises') }}</h2>
      </div>
      <div v-else-if="!firstLoading" class="flex w-full mt-4">
        <router-link class="mx-auto link" :to="{ name: 'CourseExercises' }"
          ><Btn :variant="'primary-borderless'">{{
            $t('teacher_course_dashboard.see_all')
          }}</Btn></router-link
        >
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from '@vue/runtime-core'
import { createNamespacedHelpers } from 'vuex'
const { mapActions, mapGetters, mapState } = createNamespacedHelpers('teacher')
import { courseIdMixin, coursePrivilegeMixin, loadingMixin } from '@/mixins'
import EventEditorPreview from '@/components/teacher/EventEditor/EventEditorPreview.vue'
import { CoursePrivilege, Event, Exercise } from '@/models'
import MinimalExercisePreview from '@/components/teacher/ExerciseEditor/MinimalExercisePreview.vue'
import Btn from '@/components/ui/Btn.vue'
import EventEditorPreviewSkeleton from '@/components/ui/skeletons/EventEditorPreviewSkeleton.vue'
import MinimalExercisePreviewSkeleton from '@/components/ui/skeletons/MinimalExercisePreviewSkeleton.vue'
import TextInput from '@/components/ui/TextInput.vue'
import Toggle from '@/components/ui/Toggle.vue'
import Card from '@/components/ui/Card.vue'
import TextEditor from '@/components/ui/TextEditor.vue'

export default defineComponent({
  name: 'CourseDashboard',
  components: {
    EventEditorPreview,
    MinimalExercisePreview,
    Btn,
    EventEditorPreviewSkeleton,
    MinimalExercisePreviewSkeleton,
    TextInput,
    Toggle,
    Card,
    TextEditor
  },
  mixins: [courseIdMixin, loadingMixin, coursePrivilegeMixin],
  async created () {
    await this.withFirstLoading(async () => {
      await this.getEvents(this.courseId)
      try {
        await this.getExercises({
          courseId: this.courseId,
          fromFirstPage: true
        })
      } catch {
        // TODO don't render exercises stuff
      }
      //await this.getTags(this.courseId)
    })
  },
  data () {
    return {
      editingName: false,
      dirtyCourseName: '',
      editingDescription: false,
      dirtyCourseDescription: '',
      CoursePrivilege
    }
  },
  methods: {
    ...mapActions(['getExercises', 'getEvents', 'getTags']),
    editCourseName () {
      this.dirtyCourseName = this.currentCourse.name
      this.editingName = true
    },
    editCourseDescription () {
      this.dirtyCourseDescription = this.currentCourse.description ?? ''
      this.editingDescription = true
    },
    async onDoneEditing (discard = false) {
      this.editingName = false
    }
  },
  computed: {
    ...mapGetters(['exams']),
    ...mapState(['exercises']),
    recentExams (): Event[] {
      return this.exams.slice(0, 3)
    },
    recentExercises (): Exercise[] {
      return this.exercises.slice(0, 4)
    }
  }
})
</script>

<style></style>
