<template>
  <div class="hello">
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

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
