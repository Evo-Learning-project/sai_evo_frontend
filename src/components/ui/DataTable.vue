<template>
  <ag-grid-vue
    :style="style"
    class="ag-theme-alpine"
    :columnDefs="columnDefs"
    :rowData="rowData"
  ></ag-grid-vue>
</template>

<script lang="ts">
/* eslint-disable @typescript-eslint/no-explicit-any */
import 'ag-grid-community/dist/styles/ag-grid.css'
import 'ag-grid-community/dist/styles/ag-theme-alpine.css'
import { defineComponent, PropType } from '@vue/runtime-core'
import { AgGridVue } from 'ag-grid-vue3'

export default defineComponent({
  name: 'DataTable',
  components: {
    AgGridVue
  },
  props: {
    columnDefs: {
      type: Array as PropType<{ field: string }[]>,
      required: true
    },
    rowData: {
      type: Array,
      required: true
    }
  },
  data () {
    return {
      //columnDefs: [] as any,
      //rowData: [] as any,
      style: 'width: 100%; height: 300px'
    }
  },
  mounted () {
    // this.columnDefs = [
    //   { field: 'make' },
    //   { field: 'model' },
    //   { field: 'price' }
    // ]
    // this.rowData = [
    //   { make: 'Toyota', model: 'Celica', price: 35000 },
    //   { make: 'Ford', model: 'Mondeo', price: 32000 },
    //   { make: 'Porsche', model: 'Boxter', price: 72000 }
    // ]
  }
})
</script>

<style></style>
