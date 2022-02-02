<template>
  <ag-grid-vue
    :style="style"
    class="ag-theme-material"
    suppressRowHoverHighlight="true"
    suppressCellSelection="false"
    :columnDefs="columnDefs"
    :rowData="rowData"
    @cell-click="$emit('cellClicked', $event)"
    @first-data-rendered="onGridReady"
  ></ag-grid-vue>
</template>

<script lang="ts">
/* eslint-disable @typescript-eslint/no-explicit-any */
import 'ag-grid-community/dist/styles/ag-grid.css'
import 'ag-grid-community/dist/styles/ag-theme-material.css'
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
  methods: {
    onGridReady (params: any) {
      console.log('READY', params)
      this.$emit('gridReady', params)
      // this.gridApi = params.api;
      // this.gridColumnApi = params.columnApi;
    }
  }
})
</script>

<style></style>
