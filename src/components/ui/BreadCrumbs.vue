<template>
  <div class="flex items-center text-xs text-muted">
    <span class="text-base material-icons-outlined">
      home
    </span>
    <span class="text-base material-icons-outlined opacity-60"
      >navigate_next</span
    >
    <div
      v-for="(breadcrumb, index) in breadcrumbs"
      :key="'breadcrumb-' + index"
      class="flex items-center"
    >
      <span
        class="font-semibold opacity-80"
        v-if="breadcrumb.routeName === $route.name"
        >{{ breadcrumb.title }}</span
      >
      <router-link
        v-else
        :to="{
          name: breadcrumb.routeName
        }"
        class="link"
        >{{ breadcrumb.title }}</router-link
      >
      <span
        v-if="index !== breadcrumbs.length - 1"
        class="text-base material-icons-outlined opacity-60"
        >navigate_next</span
      >
    </div>
  </div>
</template>

<script lang="ts">
import { courseIdMixin, eventIdMixin } from '@/mixins'
import { BreadCrumb } from '@/navigation/breadcrumbs'
import {
  ROUTE_TITLE_COURSE_NAME_TOKEN,
  ROUTE_TITLE_EVENT_NAME_TOKEN
} from '@/navigation/const'
import { defineComponent, PropType } from '@vue/runtime-core'
import { RouteLocationNormalizedLoaded } from 'vue-router'

export default defineComponent({
  name: 'BreadCrumbs',
  mixins: [courseIdMixin, eventIdMixin],
  props: {
    route: {
      type: Object as PropType<RouteLocationNormalizedLoaded>,
      required: true
    }
  },
  methods: {
    replaceTitleTokens (str: string) {
      return str
        ?.replace(ROUTE_TITLE_COURSE_NAME_TOKEN, this.currentCourse.name)
        ?.replace(ROUTE_TITLE_EVENT_NAME_TOKEN, this.currentEvent)
    }
  },
  computed: {
    breadcrumbs (): BreadCrumb[] {
      return ((this.route.meta.breadcrumbs as BreadCrumb[]) ?? []).map(b => ({
        ...b,
        title: this.replaceTitleTokens(b.title)
      }))
    }
  }
})
</script>

<style></style>
