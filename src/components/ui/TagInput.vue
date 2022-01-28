<template>
  <vue-tags-input
    v-model="tag"
    :tags="processedModelValue"
    :allow-edit-tags="true"
    :placeholder="placeholder"
    @before-adding-tag="beforeAddingTag($event)"
    @before-deleting-tag="beforeDeletingTag($event)"
  />
  <!--@tags-changed="newTags => onTagsChanged(newTags)"-->
  <!--
          
-->
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
  props: ['modelValue', 'placeholder'],
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
      console.log('before adding', event.tag.text)
      if (
        !this.processedModelValue
          .map((t: { text: string }) => t.text)
          .includes(event.tag.text)
      ) {
        this.$emit('addTag', event.tag.text)
        this.tag = ''
      }
    },
    beforeDeletingTag (event: any) {
      console.log('before deleting', event.tag.text)
      //event.deleteTag()
      this.$emit('removeTag', event.tag.text)
    },
    processTag (tag: { text: string }) {
      return {
        name: tag.text
      }
    }
  },
  computed: {
    processedModelValue () {
      return this.modelValue.map((t: { name: string }) => ({
        text: t?.name
      }))
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
