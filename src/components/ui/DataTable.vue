<template>
  <ag-grid-vue :columnDefs="columnDefs" :rowData="rowData"></ag-grid-vue>
</template>

<script lang="ts">
/* eslint-disable @typescript-eslint/no-explicit-any */

import { defineComponent } from '@vue/runtime-core'
import { AgGridVue } from 'ag-grid-vue3'

export default defineComponent({
  name: 'DataTable',
  components: {
    AgGridVue
  },
  data () {
    return {
      columnDefs: [] as any,
      rowData: [] as any
    }
  },
  mounted () {
    this.columnDefs = [
      { field: 'make' },
      { field: 'model' },
      { field: 'price' }
    ]

    this.rowData = [
      { make: 'Toyota', model: 'Celica', price: 35000 },
      { make: 'Ford', model: 'Mondeo', price: 32000 },
      { make: 'Porsche', model: 'Boxter', price: 72000 }
    ]
  }
})
</script>

<style></style>
