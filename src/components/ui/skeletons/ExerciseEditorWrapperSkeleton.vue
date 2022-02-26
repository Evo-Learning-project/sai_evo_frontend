<template>
  <Card>
    <template v-slot:header>
      <div class="relative">
        <div class="absolute top-0 flex w-full ">
          <div class="w-5/12 h-5 mr-4 skeleton-unit"></div>
          <div class="w-1/12 h-5 mr-2 rounded-full skeleton-unit"></div>
          <div class="w-1/12 h-5 rounded-full skeleton-unit"></div>
          <div class="w-10 h-5 ml-auto rounded-full skeleton-unit"></div>
        </div>
        <div class="flex items-center opacity-0">
          <h4>&nbsp;</h4>
          <div class="my-auto ml-4 chip ">
            <div class="flex items-center">
              <p>&nbsp;</p>
            </div>
          </div>
        </div>
      </div>
    </template>

    <template v-slot:body>
      <div class="relative h-20">
        <div class="absolute top-0 flex flex-col w-full space-y-2 max-h-20">
          <div class="w-full h-5 skeleton-unit"></div>
          <div class="w-full h-5 skeleton-unit"></div>
          <div class="w-full h-5 skeleton-unit"></div>
        </div>
        <div
          class="overflow-x-hidden overflow-y-auto opacity-0 overflow-ellipsis max-h-20"
        >
          <div>&nbsp;</div>
        </div>
      </div>
    </template>
  </Card>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import Card from '../Card.vue'

export default defineComponent({
  name: 'ExerciseEditorWrapperSkeleton',
  components: { Card }
})
</script>

<style></style>
