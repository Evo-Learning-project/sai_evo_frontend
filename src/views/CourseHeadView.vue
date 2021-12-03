<template>
  <h1>Corso {{ $route.params.id }}</h1>
  <toggle v-model="t">Test</toggle>
  <text-input></text-input>
  <router-view></router-view>
</template>

<script>
import Toggle from '@/components/ui/Toggle.vue'
import TextInput from '@/components/ui/TextInput.vue'
export default {
  /*
  This empty view is used to achieve two-level nesting of routes such as
  `teacher/course/:id/exercises` without having to re-define the second
  part of the route for each grandchild
  */
  name: 'CourseHeadView',
  components: {
    Toggle,
    TextInput
  },
  data () {
    return {
      t: false
    }
  }
}
</script>
