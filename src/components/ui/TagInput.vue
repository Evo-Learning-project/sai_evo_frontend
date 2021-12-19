<template>
  <vue-tags-input
    v-model="tag"
    :tags="processedModelValue"
    @tags-changed="newTags => onTagsChanged(newTags)"
    @before-adding-tag="beforeAddingTag($event)"
    @adding-duplicate="onAddingDuplicate($event)"
  />
</template>

<script lang="ts">
/* eslint-disable @typescript-eslint/no-explicit-any */

import VueTagsInput from '@sipec/vue3-tags-input'
import { defineComponent } from '@vue/runtime-core'

export default defineComponent({
  name: 'TagInput',
  components: {
    VueTagsInput
  },
  props: ['modelValue'],
  data () {
    return {
      tag: '',
      tags: [] as unknown[]
    }
  },
  methods: {
    onTagsChanged (newTags: any) {
      //   this.tags = newTags
      //   console.log(
      //     'new tags',
      //     newTags.map((t: { text: string }) => t.text)
      //   )
      this.$emit(
        'update:modelValue',
        newTags.map((t: { text: string }) => this.processTag(t))
      )
    },
    beforeAddingTag (event: any) {
      console.log('adding', event.tag.text)
      event.addTag()
    },
    onAddingDuplicate (event: any) {
      console.log('DUPLICATE', event)
    },
    processTag (tag: { text: string }) {
      return {
        name: tag.text
      }
    }
  },
  computed: {
    processedModelValue () {
      return this.modelValue.map((t: { name: string }) => t.name)
    }
  }
})
</script>

<style>
.ti-input {
  border: 0 !important; /*1px px solid #ccc;*/
  display: flex;
  padding: 4px;
  flex-wrap: wrap;
}
</style>
