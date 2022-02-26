<template>
  <Card :marginLess="true">
    <template v-slot:header>
      <div class="relative">
        <div class="absolute top-0 flex w-full space-x-4">
          <div class="w-9/12 skeleton-unit"></div>
          <div class="w-3/12 ml-auto rounded-full skeleton-unit"></div>
        </div>
        <div class="flex items-start w-full opacity-0">
          <h3
            class="flex-grow"
            style="
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
            overflow:hidden
            "
          >
            &nbsp;
          </h3>
          <div class="ml-auto">
            <div class="mr-0 chip">
              <div class="flex items-center">
                <p>&nbsp;</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </template>
    <template v-slot:body>
      <div class="relative">
        <div class="absolute top-0 w-full">
          <div class="flex w-full mb-2 space-x-2">
            <div class="w-1/2 h-5 skeleton-unit"></div>
            <div class="w-1/2 h-5 skeleton-unit"></div>
          </div>
          <div class="flex w-full space-x-2">
            <div class="w-1/2 h-5 skeleton-unit"></div>
            <div class="w-1/2 h-5 skeleton-unit"></div>
          </div>
          <div class="flex justify-between w-full mt-8">
            <div class="w-20 rounded-md skeleton-unit"></div>
            <div class="w-20 rounded-md skeleton-unit"></div>
          </div>
        </div>
        <div class="opacity-0">
          <div class="flex flex-col h-full">
            <div class="mt-1 mb-4 space-y-1 text-sm">
              <div class="flex space-x-1">
                <p class="text-muted">&nbsp;</p>
              </div>
              <div class="flex space-x-1">
                <p class="text-muted">&nbsp;</p>
              </div>
            </div>
            <div class="flex items-end mt-auto">
              <div class="flex mr-auto space-x-2">
                <Btn>&nbsp;</Btn>
              </div>
            </div>
          </div>
        </div>
      </div>
    </template>
  </Card>
</template>

<script lang="ts">
import { defineComponent } from '@vue/runtime-core'
import Btn from '../Btn.vue'
import Card from '../Card.vue'

export default defineComponent({
  name: 'EventEditorPreviewSkeleton',
  components: { Btn, Card }
})
</script>

<style></style>
