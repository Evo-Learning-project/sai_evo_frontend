<template>
  <div>
    <div
      v-if="saving"
      class="flex items-center ml-auto mr-8 space-x-1 text-muted"
    >
      <spinner :size="'sm'"></spinner>
      <p class="text-sm">{{ $t('exercise_editor.saving') }}</p>
    </div>
    <div v-else class="flex items-center ml-auto mr-8 space-x-1 text-muted">
      <div class="tooltip">
        <span
          class="text-base cursor-default select-none material-icons-outlined hover:text-primary"
        >
          cloud_done
        </span>
        <span class="tooltip-text tooltip-left">{{
          $t('misc.changes_saved_to_server')
        }}</span>
      </div>
      <p v-if="showSaved" class="mb-0.5 text-sm">
        {{ $t('exercise_editor.saved') }}
      </p>
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
<style scoped></style>
