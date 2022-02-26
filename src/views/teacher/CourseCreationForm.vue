<template>
  <div class="">
    <div class="flex flex-col h-full space-y-8">
      <div class="flex flex-col space-y-4.5">
        <TextInput v-model="course.name">
          {{ $t('course_creation_form.course_name') }}
          <template v-if="v$.course.name.$errors.length > 0" v-slot:errors>
            <div
              class="input-errors"
              v-for="error of v$.course.name.$errors"
              :key="error.$uid"
            >
              <div class="error-msg">
                {{ $t('validation_errors.' + error.$uid) }}
              </div>
            </div>
          </template>
        </TextInput>
        <!-- <div
          class="input-errors"
          v-for="error of v$.firstName.$errors"
          :key="error.$uid"
        >
          <div class="error-msg">{{ error.$message }}</div>
        </div> -->
        <TextEditor v-model="course.description">
          {{ $t('course_creation_form.course_description') }}
        </TextEditor>
      </div>
      <div class="flex flex-col space-y-1">
        <h4>{{ $t('course_creation_form.course_visibility') }}</h4>
        <Toggle v-model="course.hidden">
          {{ $t('course_creation_form.hide_course') }}
        </Toggle>
        <p class="text-muted" v-if="course.hidden">
          {{ $t('course_creation_form.hidden_description') }}
        </p>
        <p class="text-muted" v-else>
          {{ $t('course_creation_form.public_description') }}
        </p>
      </div>
      <div class="flex flex-col flex-grow mb-8 space-y-2">
        <h4>{{ $t('course_creation_form.import_exercises') }}</h4>
        <p class="text-muted">
          {{ $t('course_creation_form.import_exercises_description') }}
        </p>
        <FileUpload></FileUpload>
      </div>
      <Btn
        @click="v$.$invalid ? v$.$touch() : onCreate()"
        class="mt-auto mr-auto"
        :variant="'success'"
        :loading="localLoading"
      >
        <span class="mr-1 text-base material-icons-outlined">done</span
        >{{ $t('course_creation_form.create') }}</Btn
      >
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from '@vue/runtime-core'
import TextInput from '@/components/ui/TextInput.vue'
import TextEditor from '@/components/ui/TextEditor.vue'
import { getBlankCourse } from '@/models'
import Toggle from '@/components/ui/Toggle.vue'
import FileUpload from '../../components/ui/FileUpload.vue'
import Btn from '@/components/ui/Btn.vue'
import useVuelidate from '@vuelidate/core'
import { mapState } from 'vuex'

import { createNamespacedHelpers } from 'vuex'
import { loadingMixin } from '@/mixins'
import { courseValidation } from '@/validation/models'
const { mapActions } = createNamespacedHelpers('teacher')

export default defineComponent({
  name: 'CourseCreationForm',
  components: { TextInput, TextEditor, Toggle, FileUpload, Btn },
  setup () {
    return { v$: useVuelidate() }
  },
  mixins: [loadingMixin],
  data () {
    return {
      course: getBlankCourse()
    }
  },
  validations () {
    return {
      course: courseValidation
    }
  },
  methods: {
    ...mapActions(['createCourse']),
    async onCreate () {
      await this.withLocalLoading(async () => {
        const course = await this.createCourse(this.course)
        await this.$store.dispatch('shared/getCourses')
        this.$router.push({
          name: 'TeacherCourseDashboard',
          params: {
            courseId: course.id
          }
        })
      })

      this.$store.commit('shared/showSuccessFeedback')
    }
  },
  computed: {
    ...mapState('shared', ['courses'])
  }
})
</script>

<style></style>
