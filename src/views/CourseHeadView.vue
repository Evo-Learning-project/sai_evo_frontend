<template>
  <h2 class="mb-8">
    {{ $t('headings.course_title') }} {{ $route.params.id }}
    {{ $route.meta.routeTitle ? ' &mdash; ' + $route.meta.routeTitle : '' }}
  </h2>
  <router-view></router-view>
</template>

<script lang="ts">
import { defineComponent } from '@vue/runtime-core'
export default defineComponent({
  /*
  This empty view is used to achieve two-level nesting of routes such as
  `teacher/course/:id/exercises` without having to re-define the second
  part of the route for each grandchild
  */
  name: 'CourseHeadView'
})
</script>
