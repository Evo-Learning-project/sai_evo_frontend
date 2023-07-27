<template>
	<div class="darken-on-hover">
		<div
			:class="{
				'border-danger-dark focus-within:border-danger-dark': $slots.errors,
			}"
			class="relative z-10 border-b-2 border-gray-200 bg-light w-max"
		>
			<!-- <div class="z-10 bg-transparent floating-label"> -->
			<date-picker
				class="z-10 bg-transparent calendar-floating-label"
				@open="onOpen()"
				:open="calendarOpen"
				@close="onClose()"
				@focus="$emit('focus')"
				v-model:value="proxyModelValue"
				type="datetime"
				:ref="'calendar-' + elementId"
				:show-second="false"
				:formatter="momentFormat"
				:title-time-format="'DD-MM-YYYY'"
				:shortcuts="shortcuts"
			>
				<!-- :disabledDate="isDateDisabledFn"
				 :disabledTime="isTimeDisabledFn" -->
				<template v-slot:icon-calendar
					><span class="text-base material-icons-outlined"> calendar_today </span>
				</template>
				<template v-slot:icon-clear
					><span class="text-base material-icons-outlined"> close </span>
				</template>
			</date-picker>
			<!-- </div> -->
			<label
				class="absolute left-1.5 origin-0 -z-1"
				:class="{
					'calendar-fixed-label': proxyModelValue != null || calendarOpen,
					'bottom-1.5': proxyModelValue == null,
				}"
			>
				<slot></slot>
			</label>
		</div>
		<div v-if="$slots.errors?.()" class="text-sm font-light text-danger-dark">
			<slot name="errors"></slot>
		</div>
	</div>
</template>

<script lang="ts">
import { getTranslatedString as _ } from "@/i18n";
import { defineComponent } from "@vue/runtime-core";
import moment from "moment";
import { v4 as uuid4 } from "uuid";

import DatePicker from "vue-datepicker-next";
import "vue-datepicker-next/index.css";
import "vue-datepicker-next/locale/it";

export default defineComponent({
	name: "CalendarInput",
	components: { DatePicker },
	props: {
		modelValue: {
			required: true,
		},
		// allowPast: {
		// 	type: Boolean,
		// 	default: false,
		// },
	},
	created() {
		this.elementId = uuid4();
	},
	data() {
		return {
			calendarOpen: false,
			elementId: "",
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
		};
	},
	methods: {
		onOpen() {
			this.calendarOpen = true;
			this.$emit("open");
		},
		onClose() {
			this.calendarOpen = false;
			this.$emit("close");
		},
		close() {
			this.calendarOpen = false;
		},
	},
	computed: {
		proxyModelValue: {
			get() {
				if (!this.modelValue) {
					return null;
				}
				if (typeof this.modelValue === "string") {
					// TODO move this to converter in API module
					return new Date(this.modelValue.replace(" ", "T"));
				}

				return this.modelValue;
			},
			set(val: unknown) {
				this.$emit("update:modelValue", val);
			},
		},
		// isDateDisabledFn() {
		// 	if (this.allowPast) {
		// 		return () => false;
		// 	}
		// 	return date => {
		// 		if (date === this.modelValue) {
		// 			return false;
		// 		}
		// 		const today = new Date();
		// 		const midnight = new Date(today.getFullYear(), today.getMonth(), today.getDate());
		// 		return date.getTime() < midnight.getTime();
		// 	};
		// },
		// isTimeDisabledFn() {
		// 	if (this.allowPast) {
		// 		return () => false;
		// 	}
		// 	return date => {
		// 		if (date === this.modelValue) {
		// 			return false;
		// 		}
		// 		return date < new Date();
		// 	};
		// },
		shortcuts() {
			const nineAMToday = new Date();
			nineAMToday.setHours(9, 0, 0, 0);

			const twoPMToday = new Date();
			twoPMToday.setHours(14, 0, 0, 0);

			return [
				...(new Date() > nineAMToday
					? []
					: [{ text: _("misc.this_morning"), onClick: () => nineAMToday }]),
				...(new Date() > twoPMToday
					? []
					: [
							{
								text: _("misc.this_afternoon"),
								onClick: () => twoPMToday,
							},
					  ]),
				{
					text: _("misc.tomorrow_morning"),
					onClick: () => {
						const tomorrow = new Date();
						tomorrow.setDate(tomorrow.getDate() + 1); // set the date to tomorrow
						tomorrow.setHours(9, 0, 0, 0);
						return tomorrow;
					},
				},
				{
					text: _("misc.tomorrow_afternoon"),
					onClick: () => {
						const tomorrow = new Date();
						tomorrow.setDate(tomorrow.getDate() + 1); // set the date to tomorrow
						tomorrow.setHours(14, 0, 0, 0);
						return tomorrow;
					},
				},
				{
					text: _("misc.next_week"),
					onClick: () => {
						const date = new Date();
						date.setTime(date.getTime() + 3600 * 1000 * 24 * 7);
						return date;
					},
				},
			];
		},
	},
});
</script>

<style>
.mx-input-wrapper,
.mx-input {
	background-color: transparent !important;
}
</style>
