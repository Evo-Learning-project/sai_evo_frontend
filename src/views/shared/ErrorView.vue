<template>
  <div class="flex flex-col items-center w-full mx-auto -ml-5 mt-14">
    <p style="font-size: 10rem" class="material-icons-outlined opacity-10">
      {{ pageWideErrorData.icon }}
    </p>
    <h2 class="opacity-40">{{ pageWideErrorData.title }}</h2>
    <Btn @click="$router.go(0)" class="">{{ $t('errors.retry') }}</Btn>
  </div>
</template>

<script lang="ts">
import { defineComponent } from '@vue/runtime-core'
import { mapState } from 'vuex'
import Btn from '@/components/ui/Btn.vue'

export default defineComponent({
  name: 'ErrorView',
  computed: {
    ...mapState('shared', ['pageWideErrorData'])
  },
  components: { Btn }
})
</script>

<style></style>
