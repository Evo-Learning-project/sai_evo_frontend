<template>
  <ag-grid-vue
    :style="style"
    :suppressRowClickSelection="true"
    :alwaysShowHorizontalScroll="true"
    class="ag-theme-material"
    suppressRowHoverHighlight="true"
    suppressCellSelection="false"
    :columnDefs="columnDefs"
    :rowSelection="'multiple'"
    :isRowSelectable="isRowSelectable"
    :getRowClass="getRowClass"
    :rowData="rowData"
    @cell-click="$emit('cellClicked', $event)"
    @selection-change="$emit('selectionChanged', $event)"
    @first-data-rendered="onGridReady"
    :localeTextFunc="localeTextFunc"
  ></ag-grid-vue>
</template>

<script lang="ts">
/* eslint-disable @typescript-eslint/no-explicit-any */
import 'ag-grid-community/dist/styles/ag-grid.css'
import 'ag-grid-community/dist/styles/ag-theme-material.css'
import { defineComponent, PropType } from '@vue/runtime-core'
import { AgGridVue } from 'ag-grid-vue3'
import { ColDef } from 'ag-grid-community'
import { getTranslatedString as _ } from '@/i18n'

export default defineComponent({
  name: 'DataTable',
  components: {
    AgGridVue
  },
  props: {
    columnDefs: {
      type: Array as PropType<ColDef[]>,
      required: true
    },
    rowData: {
      type: Array,
      required: true
    },
    isRowSelectable: {
      type: Function,
      default: () => true
    },
    getRowClass: {
      type: Function,
      default: () => ''
    }
  },
  data () {
    return {
      //columnDefs: [] as any,
      //rowData: [] as any,
      style: 'width: 100%; height: 100%; min-height: 300px'
    }
  },
  methods: {
    localeTextFunc (key: string) {
      return _('data_table.' + key)
    },
    onGridReady (params: any) {
      //console.log('READY', params)
      this.$emit('gridReady', params)
    }
  }
})
</script>

<style></style>
