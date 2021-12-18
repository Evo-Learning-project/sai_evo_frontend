<template>
  <h1>Corso {{ $route.params.id }}</h1>
  <toggle v-model="t">Test</toggle>
  <text-input></text-input>
  <text-editor></text-editor>
  <dropdown v-model="selected" :options="['a', 'b', 'c']"></dropdown>

  <div class="h-2 my-10"></div>
  <div class="flex items-center space-x-2">
    <div class="flex flex-col -space-y-1.5 scale-90 origin-0 transform">
      <span class="text-xs material-icons"> check_box </span
      ><span class="text-xs material-icons"> check_box </span
      ><span class="text-xs material-icons">
        check_box_outline_blank
      </span>
    </div>
    <p>Scelta multipla con più scelte possibili</p>
  </div>
  <div class="flex items-center space-x-2">
    <div class="flex flex-col -space-y-1.5 transform scale-90 origin-0">
      <span class="text-xs material-icons"> radio_button_checked </span
      ><span class="text-xs material-icons"> radio_button_unchecked </span
      ><span class="text-xs material-icons">
        radio_button_unchecked
      </span>
    </div>
    <p>Scelta multipla con una sola scelta possibile</p>
  </div>
  <!-- <radio-group v-model="selectedRadio" :options="radioChoices"></radio-group> -->
  <exercise-editor></exercise-editor>
  <router-view></router-view>
</template>

<script>
import { ExerciseType } from '@/models'
import { getTranslatedString as _ } from '@/i18n'

import Toggle from '@/components/ui/Toggle.vue'
// import RadioGroup from '@/components/ui/RadioGroup.vue'
import Dropdown from '@/components/ui/Dropdown.vue'
import TextInput from '@/components/ui/TextInput.vue'
import TextEditor from '@/components/ui/TextEditor.vue'
import ExerciseEditor from '@/components/teacher/ExerciseEditor.vue'
export default {
  /*
  This empty view is used to achieve two-level nesting of routes such as
  `teacher/course/:id/exercises` without having to re-define the second
  part of the route for each grandchild
  */
  name: 'CourseHeadView',
  components: {
    Toggle,
    TextInput,
    TextEditor,
    Dropdown,
    ExerciseEditor
    //RadioGroup
  },
  data () {
    return {
      t: false,
      selected: '',
      selectedRadio: null
    }
  },
  computed: {
    radioChoices () {
      return Object.keys(ExerciseType)
        .filter(key => parseInt(key) == key) //(ExerciseType[key] as unknown) == 'number')
        .map(key => ({
          value: key,
          content: _('exercise_types.' + key)
        }))
    }
  }
}
</script>
