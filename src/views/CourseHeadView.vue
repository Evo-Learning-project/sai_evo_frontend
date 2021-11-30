<template>
  <h1>Corso {{ $route.params.id }}</h1>
  <router-view></router-view>
</template>

<script>
export default {
  /*
  This empty view is used to achieve two-level nesting of routes such as
  `teacher/course/:id/exercises` without having to re-define the second
  part of the route for each grandchild
  */
  name: 'CourseHeadView'
}
</script>

<style></style>
