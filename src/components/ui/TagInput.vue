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
    :autocomplete-min-length="1"
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
  watch: {
    serializedProcessedModelValue (_newVal, _oldVal) {
      if (this.ignoreWatcher) {
        return
      }
      const newVal = JSON.parse(_newVal)
      const oldVal = JSON.parse(_oldVal)

      if (this.addingTag.length > 0 && newVal.length > oldVal.length) {
        this.addingTag = ''
      } else if (this.removingTag.length > 0 && newVal.length < oldVal.length) {
        this.removingTag = ''
      }
    }
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
      tag: '',
      addingTag: '',
      removingTag: '',
      ignoreWatcher: false
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

        // this triggers ghost tag without having the watcher immediately remove it
        this.ignoreWatcher = true
        this.addingTag = event.tag.text
        this.$nextTick(() => (this.ignoreWatcher = false))

        this.tag = ''
      }
    },
    beforeDeletingTag (event: any) {
      this.removingTag = event.tag.text
      this.$emit('removeTag', event.tag.text)
    },
    processTag (tag: { text: string }) {
      return {
        name: tag.text
      }
    }
  },
  computed: {
    serializedProcessedModelValue () {
      return JSON.stringify(this.processedModelValue)
    },
    processedModelValue () {
      const ret = this.modelValue.map((t: Tag) => ({
        text: t.name,
        classes:
          t.name === this.removingTag ? 'opacity-50 pointer-events-none' : ''
      }))

      const ghostTag = {
        text: this.addingTag,
        classes: 'opacity-50 pointer-events-none'
      }

      return [...ret, ...(this.addingTag.length > 0 ? [ghostTag] : [])]
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
