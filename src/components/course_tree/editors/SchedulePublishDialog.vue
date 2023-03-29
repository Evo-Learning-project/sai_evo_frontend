<template>
	<div>
		<Dialog
			:loading="loading"
			:noText="$t('dialog.default_cancel_text')"
			:yesText="$t('course_tree.schedule_label')"
			:showDialog="visible"
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
	},
	data() {
		return {
			value: null as string | null,
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
	computed: {},
	components: { Dialog, CalendarInput },
});
</script>

<style></style>
