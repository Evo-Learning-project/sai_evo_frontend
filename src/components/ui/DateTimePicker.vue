<template>
	<div class="flex relative">
		<!-- calendar widget-->
		<div>
			<DatePicker
				style="width: max-content !important"
				class="flex flex-row-reverse items-start space-x-8"
				:open="true"
				:ref="'calendar-' + elementId"
				:show-second="false"
				:formatter="momentFormat"
				:title-time-format="'DD-MM-YYYY'"
				v-model:value="draft"
				type="datetime"
				:appendToBody="false"
				:popupStyle="popupStyle"
				:inputClass="'calendar-floating-label relative z-10 border-b-2 border-gray-200 bg-light w-max'"
			>
				<template v-slot:icon-calendar
					><span class="text-base material-icons-outlined"> calendar_today </span>
				</template>
				<template v-slot:icon-clear
					><span class="text-base material-icons-outlined"> close </span>
				</template>
				<!-- <template v-slot:input>
					<div><TextInput /></div>
				</template> -->
			</DatePicker>
			<label
				class="absolute left-1.5 origin-0 -z-1"
				:class="{
					'calendar-fixed-label': draft != null,
					'bottom-1.5': draft == null,
				}"
			>
				<slot></slot>
			</label>
			<div v-if="false"><TextInput /></div>
		</div>
		<!-- inputs -->
	</div>
</template>

<script lang="ts">
import moment from "moment";

import DatePicker from "vue-datepicker-next";
import "vue-datepicker-next/index.css";
import "vue-datepicker-next/locale/it";
import { v4 as uuid4 } from "uuid";

import { defineComponent, PropType } from "@vue/runtime-core";
import TextInput from "./TextInput.vue";
export default defineComponent({
	name: "DateTimePicker",
	props: {},
	methods: {},
	data() {
		return {
			elementId: uuid4(),
			momentFormat: {
				//[optional] Date to String
				stringify: (date: moment.MomentInput) => {
					return date ? moment(date).format("LLL") : "";
				},
				//[optional]  String to Date
				parse: (value: moment.MomentInput) => {
					return value ? moment(value, "LLL").toDate() : null;
				},
				//[optional] getWeekNumber
				getWeek: (date: any) => {
					return; // a number
				},
			},
			draft: null,
			popupStyle: {
				position: "relative !important",
				top: "0 !important",
				bottom: "0 !important",
				left: "0 !important",
				right: "0 !important",
				"box-shadow": "none !important",
				margin: "0 !important",
			},
		};
	},
	computed: {},
	components: { DatePicker, TextInput },
});
</script>

<style></style>
