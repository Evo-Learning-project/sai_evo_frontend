<template>
  <div class="h-6">
    <div v-if="saving" class="flex items-center ml-auto space-x-1 text-muted">
      <Spinner :size="'sm'"></Spinner>
      <p class="text-sm">{{ $t('cloud.saving') }}</p>
    </div>
    <div
      v-else-if="!hadError"
      class="flex items-center ml-auto space-x-1 text-muted"
    >
      <div class="tooltip">
        <span
          :class="{
            'hover:bg-gray-200 hover:bg-opacity-80 rounded-md px-1.5  transition-colors duration-100': !showSaved
          }"
          class="text-base cursor-default select-none opacity-80 material-icons-outlined hover:text-primary-dark"
        >
          cloud_done
        </span>
        <span class="tooltip-text tooltip-left">{{
          $t('cloud.changes_saved_to_server')
        }}</span>
      </div>
      <p v-if="showSaved" class="mb-0.5 text-sm">
        {{ $t('cloud.saved') }}
      </p>
    </div>
    <div v-else>
      <div
        class="flex items-center space-x-1 text-sm text-muted text-danger-dark"
      >
        <span class="text-sm material-icons-outlined">error_outline</span>
        <span class="">{{ $t('cloud.error') }}</span>
      </div>
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
