<template>
  <div>
    <Card :hoverable="false" :filled="true">
      <template v-slot:header>
        <h3>Impostazioni corso</h3>
      </template>
      <template v-slot:body>
        <div class="flex justify-between mt-2">
          <div class="flex flex-col space-y-6">
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
              <TextInput class="mr-2 w-96" v-model="dirtyCourseName">
                {{ $t('course_creation_form.course_name') }}
                <template
                  v-if="v$.dirtyCourse.name.$errors.length > 0"
                  v-slot:errors
                >
                  <div
                    class="input-errors"
                    v-for="error of v$.dirtyCourse.name.$errors"
                    :key="error.$uid"
                  >
                    <div class="error-msg">
                      {{ $t('validation_errors.' + error.$uid) }}
                    </div>
                  </div>
                </template></TextInput
              >
              <Btn
                :outline="true"
                :variant="'icon'"
                :loading="localLoading"
                @click="v$.$invalid ? v$.$touch() : onDoneEditingName()"
              >
                <span class="text-xl text-primary material-icons-outlined">
                  save
                </span>
              </Btn>
              <Btn
                :outline="true"
                class=""
                :variant="'icon'"
                @click="onDoneEditingName(true)"
              >
                <span class="text-xl text-danger-dark material-icons-outlined">
                  close
                </span>
              </Btn>
            </div>
            <div class="flex items-center" v-show="!editingDescription">
              <p class="mr-2 text-muted">
                {{ $t('course_creation_form.course_description') }}
              </p>
              <p class="mr-3" v-html="currentCourse.description"></p>
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
              <TextEditor class="w-full mr-2" v-model="dirtyCourseDescription">
                {{ $t('course_creation_form.course_description') }}
              </TextEditor>
              <Btn
                :outline="true"
                :variant="'icon'"
                :loading="localLoading"
                @click="onDoneEditingDescription()"
              >
                <span class="text-xl text-primary material-icons-outlined">
                  save
                </span>
              </Btn>
              <Btn
                :outline="true"
                class=""
                :variant="'icon'"
                @click="onDoneEditingDescription(true)"
              >
                <span class="text-xl text-danger-dark material-icons-outlined">
                  close
                </span>
              </Btn>
            </div>
          </div>

          <div class="flex flex-col items-end w-2/5">
            <Toggle
              :disabled="!hasPrivileges([CoursePrivilege.UPDATE_COURSE])"
              :modelValue="currentCourse.hidden"
              @update:modelValue="onChangeCourseVisibility($event)"
              class="mb-2 mr-auto"
              :labelOnLeft="true"
            >
              {{ $t('course_creation_form.hide_course') }}
            </Toggle>
            <p class="mr-auto text-muted" v-if="currentCourse.hidden">
              {{ $t('course_creation_form.hidden_description') }}
            </p>
            <p class="mr-auto text-muted" v-else>
              {{ $t('course_creation_form.public_description') }}
            </p>
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
          class="flex flex-col w-full mt-6 mb-16 text-center select-none"
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
        class="flex flex-col w-full mt-6 text-center select-none mb-14"
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
import { Course, CoursePrivilege, Event, Exercise } from '@/models'
import MinimalExercisePreview from '@/components/teacher/ExerciseEditor/MinimalExercisePreview.vue'
import Btn from '@/components/ui/Btn.vue'
import EventEditorPreviewSkeleton from '@/components/ui/skeletons/EventEditorPreviewSkeleton.vue'
import MinimalExercisePreviewSkeleton from '@/components/ui/skeletons/MinimalExercisePreviewSkeleton.vue'
import TextInput from '@/components/ui/TextInput.vue'
import Toggle from '@/components/ui/Toggle.vue'
import Card from '@/components/ui/Card.vue'
import TextEditor from '@/components/ui/TextEditor.vue'

import useVuelidate from '@vuelidate/core'

import { courseValidation } from '@/validation/models'

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
  setup () {
    return { v$: useVuelidate() }
  },
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
  validations () {
    return {
      dirtyCourse: courseValidation
    }
  },
  methods: {
    ...mapActions(['getExercises', 'getEvents', 'getTags', 'updateCourse']),
    editCourseName () {
      this.dirtyCourseName = this.currentCourse.name
      this.editingName = true
    },
    editCourseDescription () {
      this.dirtyCourseDescription = this.currentCourse.description ?? ''
      this.editingDescription = true
    },
    async onDoneEditingName (discard = false) {
      if (!discard) {
        await this.withLocalLoading(async () => {
          await this.updateCourse({
            ...this.currentCourse,
            name: this.dirtyCourseName
          })
          this.editingName = false
        })
      } else {
        this.editingName = false
      }
    },
    async onDoneEditingDescription (discard = false) {
      if (!discard) {
        await this.withLocalLoading(async () => {
          await this.updateCourse({
            ...this.currentCourse,
            description: this.dirtyCourseDescription
          })
          this.editingDescription = false
        })
      } else {
        this.editingDescription = false
      }
    },
    async onChangeCourseVisibility (value: boolean) {
      await this.withLoading(async () => {
        await this.updateCourse({ ...this.currentCourse, hidden: value })
      })
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
    },
    dirtyCourse (): Course {
      return {
        ...this.currentCourse,
        name: this.dirtyCourseName,
        description: this.dirtyCourseDescription
      }
    }
  }
})
</script>

<style></style>
