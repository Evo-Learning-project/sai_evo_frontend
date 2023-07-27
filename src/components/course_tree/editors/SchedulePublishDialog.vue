<template>
	<div>
		<Dialog
			:loading="loading"
			:noText="$t('dialog.default_cancel_text')"
			:yesText="$t('course_tree.schedule_label')"
			:showDialog="visible"
			:disableOk="invalid"
			@yes="onYes()"
			@no="onNo()"
		>
			<!-- <template v-slot:title>
				{{ $t("course_tree.schedule_publish_title") }}
			</template> -->
			<template v-slot:body>
				<div>
					<p class="mb-6">{{ $t("course_tree.select_schedule_datetime") }}</p>
					<CalendarInput v-model="value" class="w-full">
						{{ $t("course_tree.schedule_datetime") }}
					</CalendarInput>
					<div
						class="text-danger-dark mt-4 flex items-center space-x-2"
						v-if="showErrors"
					>
						<span class="material-icons">error_outline</span>
						<p class="">{{ $t("course_tree.invalid_schedule_time") }}</p>
					</div>
				</div>
			</template>
		</Dialog>
	</div>
</template>

<script lang="ts">
import CalendarInput from "@/components/ui/CalendarInput.vue";
import Dialog from "@/components/ui/Dialog.vue";
import { defineComponent, PropType } from "@vue/runtime-core";
export default defineComponent({
	name: "SchedulePublishDialog",
	props: {
		visible: {
			type: Boolean,
			required: true,
		},
		loading: {
			type: Boolean,
			default: false,
		},
		initialValue: {
			type: Object as PropType<string | null>,
			default: null,
		},
	},
	watch: {
		visible(newVal) {
			if (!newVal) {
				this.value = null;
			} else {
				this.value = this.initialValue;
			}
		},
		value(newVal) {
			this.showErrors = newVal && this.invalid;
		},
	},
	data() {
		return {
			value: null as string | null,
			showErrors: false,
		};
	},
	methods: {
		onYes() {
			return this.$emit("confirm", this.value);
		},
		onNo() {
			return this.$emit("cancel");
		},
	},
	computed: {
		invalid() {
			if (this.value === null) {
				return true;
			}
			return new Date(this.value).getTime() - new Date().getTime() <= 5 * 1000 * 60;
		},
	},
	components: { Dialog, CalendarInput },
});
</script>

<style></style>
