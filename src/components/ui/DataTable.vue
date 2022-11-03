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
		:rowClassRules="rowClassRules"
		:rowData="rowData"
		:getRowNodeId="getRowId"
		:immutableData="true"
		:localeTextFunc="localeTextFunc"
		@cell-click="$emit('cellClicked', $event)"
		@selection-change="$emit('selectionChanged', $event)"
		@first-data-rendered="onGridReady"
		@filterChanged="onFilterChanged"
	></ag-grid-vue>
	<!-- <p>Rows: {{ rowCount }}</p> -->
</template>

<script lang="ts">
/* eslint-disable @typescript-eslint/no-explicit-any */
import "ag-grid-community/dist/styles/ag-grid.css";
import "ag-grid-community/dist/styles/ag-theme-material.css";
import { defineComponent, PropType } from "@vue/runtime-core";
import { AgGridVue } from "ag-grid-vue3";
import { ColDef } from "ag-grid-community";
import { getTranslatedString as _ } from "@/i18n";

export default defineComponent({
	name: "DataTable",
	components: {
		AgGridVue,
	},
	props: {
		columnDefs: {
			type: Array as PropType<ColDef[]>,
			required: true,
		},
		rowData: {
			type: Array,
			required: true,
		},
		isRowSelectable: {
			type: Function,
			default: () => true,
		},
		getRowClass: {
			type: Function,
			default: () => "",
		},
		rowClassRules: {
			type: Object,
			default: () => {},
		},
		getRowId: {
			type: Function,
			default: () => "",
		},
	},
	data() {
		return {
			//columnDefs: [] as any,
			//rowData: [] as any,
			style: "width: 100%; height: 100%; min-height: 300px",
			gridApi: null as any,
			rowCount: 0,
		};
	},
	methods: {
		localeTextFunc(key: string) {
			return _("data_table." + key);
		},
		onGridReady(params: any) {
			this.gridApi = params.api;
			this.$emit("gridReady", params);
		},
		onFilterChanged() {
			this.rowCount = this.gridApi?.getDisplayedRowCount() ?? 0;
		},
		// getRowId(params: any) {
		//   return params.data.id;
		// },
	},
});
</script>

<style></style>
