<template>
  <h1>Corso {{ $route.params.id }}</h1>
  <toggle v-model="t">Test</toggle>
  <text-input></text-input>
  <text-editor></text-editor>
  <dropdown v-model="selected" :options="['a', 'b', 'c']"></dropdown>

  <div class="h-2 my-10"></div>
  <exercise-editor></exercise-editor>
  <router-view></router-view>
</template>

<script>
import Toggle from '@/components/ui/Toggle.vue'
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
  },
  data () {
    return {
      t: false,
      selected: ''
    }
  }
}
</script>
