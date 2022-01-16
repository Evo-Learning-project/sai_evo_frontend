<template>
  <div>
    <div
      v-if="saving"
      class="flex items-center ml-auto mr-8 space-x-1 text-muted"
    >
      <spinner :size="'sm'"></spinner>
      <p class="text-sm">{{ $t('exercise_editor.saving') }}</p>
    </div>
    <div
      v-else-if="showSaved"
      class="flex items-center ml-auto mr-8 space-x-1 text-muted"
    >
      <span class="text-base material-icons-outlined">
        cloud_done
      </span>
      <p class="text-sm">{{ $t('exercise_editor.saved') }}</p>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from '@vue/runtime-core'
import Spinner from './Spinner.vue'

export default defineComponent({
  components: { Spinner },
  name: 'CloudSaveStatus',
  props: {
    saving: {
      type: Boolean,
      required: true
    },
    hadError: {
      type: Boolean,
      default: false
    }
  },
  watch: {
    saving (newVal: boolean, oldVal: boolean) {
      if (!newVal && oldVal) {
        // done saving
        this.showSaved = true
        setTimeout(() => (this.showSaved = false), 5000)
      }
    }
  },
  data () {
    return {
      showSaved: false
    }
  }
})
</script>

<style></style>
