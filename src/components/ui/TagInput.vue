<template>
  <vue-tags-input
    :add-only-from-autocomplete="existingOnly"
    v-model="tag"
    :tags="processedModelValue"
    :allow-edit-tags="true"
    :placeholder="placeholder"
    @before-adding-tag="beforeAddingTag($event)"
    @before-deleting-tag="beforeDeletingTag($event)"
    :autocomplete-items="autoCompleteItems"
  />
  <!--@tags-changed="newTags => onTagsChanged(newTags)"-->
  <!--
          
-->
</template>

<script lang="ts">
/* eslint-disable @typescript-eslint/no-explicit-any */

import { Tag } from '@/models'
import VueTagsInput from '@sipec/vue3-tags-input'
import { defineComponent, PropType } from '@vue/runtime-core'

export default defineComponent({
  name: 'TagInput',
  components: {
    VueTagsInput
  },
  props: {
    modelValue: {
      type: Array as PropType<Tag[]>,
      required: true
    },
    placeholder: {
      type: String
      // TODO default
    },
    choices: {
      type: Array as PropType<Tag[]>,
      default: () => []
    },
    existingOnly: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      tag: ''
    }
  },
  methods: {
    onTagsChanged (newTags: any) {
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
          .includes(event.tag.text) &&
        (!this.existingOnly ||
          this.autoCompleteItems.map(i => i.text).includes(event.tag.text))
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
      return this.modelValue.map((t: Tag) => ({
        text: t.name
      }))
    },
    processedChoices () {
      return this.choices.map((t: Tag) => ({
        text: t.name
      }))
    },
    autoCompleteItems () {
      return this.processedChoices.filter(
        (c: { text: string }) =>
          c.text.toLowerCase().indexOf(this.tag.toLowerCase()) !== -1
      )
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
