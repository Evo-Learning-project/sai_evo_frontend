<template>
  <div class="text-center">
    <p class="text-primary opacity-90">ahf</p>
    <checkbox v-model="bool"></checkbox> boolean
    <checkbox v-model="sel" :value="'a'">sel a</checkbox>
    <checkbox v-model="sel" :value="'b'"></checkbox> sel b
    <checkbox v-model="sel" :value="'c'"></checkbox> sel c
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import Checkbox from './ui/Checkbox.vue'

export default defineComponent({
  components: { Checkbox },
  name: 'HelloWorld',
  props: {
    msg: String
  },
  data () {
    return {
      bool: true,
      sel: [] as string[]
    }
  }
})
</script>
