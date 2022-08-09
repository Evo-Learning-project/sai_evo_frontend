<template>
	<div>
		<Btn
			@click="showDialog = true"
			:outline="true"
			:disabled="(eventParticipations?.length ?? 0) === 0"
			><span class="mr-1 material-icons-outlined"> file_download </span
			>{{ $t("misc.download_results") }}</Btn
		>
		<Dialog
			:showDialog="showDialog"
			:yesText="loadingReport ? $t('misc.downloading') : $t('misc.download')"
			:noText="$t('dialog.default_cancel_text')"
			:disableOk="loadingReport"
			@no="showDialog = false"
			@yes="onDownload()"
			:large="true"
		>
			<template v-slot:title>
				<h3>{{ $t("participation_downloader.download_results") }}</h3></template
			>
			<template v-slot:body>
				<div class="text-darkText">
					<p class="mb-4 text-muted">
						{{ $t("participation_downloader.introduction") }}
					</p>
					<RadioGroup v-model="selectedDownloadPreset" :options="presetsAsOptions">
						<template v-slot:item="{ description }">
							<div class="flex items-center mb-2 space-x-2">
								<p class="text-sm text-muted">{{ description }}</p>
							</div></template
						>
					</RadioGroup>
					<div
						:class="{
							'opacity-40': selectedDownloadPreset !== ReportSettingsPreset.CUSTOM,
						}"
						class="mb-12 ml-7"
					>
						<CheckboxGroup
							:disabled="selectedDownloadPreset !== ReportSettingsPreset.CUSTOM"
							:options="fieldsAsOptions"
							class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-y-2"
							@update:modelValue="
								downloadSettingsProxy = {
									...downloadSettingsProxy,
									fields: $event,
								}
							"
							:modelValue="availablePresets[ReportSettingsPreset.CUSTOM].fields"
						></CheckboxGroup>
					</div>
					<div class="flex items-center mt-12 ml-1.5 space-x-2 w-44 hidden">
						<SegmentedControls
							class="w-full"
							:options="formatsAsOptions"
							v-model="reportType"
						>
							<p>{{ $t("participation_downloader.report_type") }}</p>
						</SegmentedControls>
					</div>
					<div v-if="downloadSettings"></div>
				</div>
			</template>
		</Dialog>
	</div>
</template>

<script lang="ts">
import { getTranslatedString as _ } from "@/i18n";
import { SelectableOption } from "@/interfaces";
import { courseIdMixin, eventIdMixin, loadingMixin } from "@/mixins";
import {
	getPresets,
	ReportField,
	ReportSettings,
	ReportSettingsPreset,
	ReportType,
} from "@/reports";
import { getParticipationsAsCsv } from "@/reports/csv";
import { forceFileDownload } from "@/utils";
import { defineComponent, PropType } from "@vue/runtime-core";
import { createNamespacedHelpers } from "vuex";
import Btn from "../ui/Btn.vue";
import Dialog from "../ui/Dialog.vue";
import RadioGroup from "../ui/RadioGroup.vue";
import SegmentedControls from "../ui/SegmentedControls.vue";
import CheckboxGroup from "../ui/CheckboxGroup.vue";
import { EventParticipation } from "@/models";
const { mapState, mapActions, mapGetters } = createNamespacedHelpers("teacher");

const LOCAL_STORAGE_SETTINGS_KEY = "report_settings";
const CUSTOM_SETTINGS_KEY = "custom_settings";
export default defineComponent({
	name: "CsvParticipationDownloader",
	props: {},
	mixins: [loadingMixin, courseIdMixin, eventIdMixin],
	components: { Btn, Dialog, RadioGroup, SegmentedControls, CheckboxGroup },
	watch: {
		settingsAsJson(newVal, _oldVal) {
			const oldVal = JSON.parse(_oldVal);
			if (_oldVal) {
				localStorage.setItem(LOCAL_STORAGE_SETTINGS_KEY, newVal);
			}
		},
	},
	created() {
		// restore last used settings
		if (LOCAL_STORAGE_SETTINGS_KEY in localStorage) {
			const settings = JSON.parse(
				localStorage.getItem(LOCAL_STORAGE_SETTINGS_KEY) as string,
			);
			this.reportType = settings.reportType ?? ReportType.CSV;
			this.selectedDownloadPreset =
				settings.selectedDownloadPreset ?? ReportSettingsPreset.MAT_AND_SCORES;
			if (CUSTOM_SETTINGS_KEY in settings) {
				Object.assign(this.availablePresets[ReportSettingsPreset.CUSTOM], {
					...this.availablePresets[ReportSettingsPreset.CUSTOM],
					...settings[CUSTOM_SETTINGS_KEY],
				});
			}
		}

		// pre-fetch data and save returned Promise so it can be awaited
		// when user actually tries to download participations
		this.apiCallPromise = (async () =>
			(this.participations = await this.getReportData()))();
	},
	data() {
		return {
			loadingReport: false,
			showDialog: false,
			downloadSettings: null as ReportSettings | null,
			selectedDownloadPreset: ReportSettingsPreset.MAT_AND_SCORES,
			availablePresets: getPresets(),
			reportType: ReportType.CSV,
			ReportSettingsPreset,
			apiCallPromise: null as Promise<any> | null,
			participations: [] as EventParticipation[],
		};
	},
	methods: {
		...mapActions(["getEventParticipations"]),
		async onDownload() {
			this.loadingReport = true;
			try {
				const participations = await this.apiCallPromise;
				const fileContents = this.formatDataForReportType(participations);
				this.downloadReportFile(
					fileContents,
					this.event(this.eventId).name +
						(this.reportType === ReportType.CSV ? ".csv" : ".pdf"),
				);
			} finally {
				setTimeout(() => (this.loadingReport = false), 1500);
			}
		},
		async getReportData() {
			try {
				// TODO download to local data instead of saving to store
				const participations = await this.getEventParticipations({
					courseId: this.courseId,
					eventId: this.eventId,
					includeDetails: true,
					forCsv: this.reportType === ReportType.CSV,
					mutate: false,
				});
				return participations;
			} catch (e) {
				this.setErrorNotification(e);
			}
		},
		formatDataForReportType(data: any) {
			if (this.reportType === ReportType.CSV) {
				return getParticipationsAsCsv(data, this.downloadSettingsProxy).replace(
					/(\\r)?\\n/g,
					"\n",
				);
			}
			// TODO implement PDF
			throw new Error("pdf unimplemented");
		},
		downloadReportFile(data: any, filename: string) {
			forceFileDownload(
				{
					data,
				},
				filename,
			);
		},
	},
	computed: {
		...mapState(["eventParticipations"]),
		...mapGetters(["event"]),
		settingsAsJson(): string {
			return JSON.stringify({
				reportType: this.reportType,
				selectedDownloadPreset: this.selectedDownloadPreset,
				[CUSTOM_SETTINGS_KEY]: this.availablePresets[ReportSettingsPreset.CUSTOM],
			});
		},
		downloadSettingsProxy: {
			get() {
				return this.availablePresets[this.selectedDownloadPreset];
			},
			set(val: ReportSettings) {
				Object.assign(this.downloadSettingsProxy, val);
			},
		},
		formatsAsOptions(): SelectableOption[] {
			return [
				{
					value: ReportType.CSV,
					content: _("misc.csv"),
				},
				{
					value: ReportType.PDF,
					content: _("misc.pdf"),
				},
			];
		},
		presetsAsOptions(): SelectableOption[] {
			return [
				{
					value: ReportSettingsPreset.MAT_AND_SCORES,
					content: _("participation_downloader.mat_and_scores_title"),
				},
				{
					value: ReportSettingsPreset.FULL_NAME_AND_SCORES,
					content: _("participation_downloader.full_name_and_scores_title"),
				},
				{
					value: ReportSettingsPreset.ALL_FIELDS,
					content: _("participation_downloader.all_fields_title"),
					description: _("participation_downloader.all_fields_description"),
				},
				{
					value: ReportSettingsPreset.CUSTOM,
					content: _("participation_downloader.custom_title"),
					description: _("participation_downloader.custom_description"),
				},
			];
		},
		fieldsAsOptions(): SelectableOption[] {
			return [
				{
					value: ReportField.STUDENT_MAT,
					content: _("report_fields." + ReportField.STUDENT_MAT),
				},
				{
					value: ReportField.STUDENT_FULL_NAME,
					content: _("report_fields." + ReportField.STUDENT_FULL_NAME),
				},
				{
					value: ReportField.STUDENT_EMAIL,
					content: _("report_fields." + ReportField.STUDENT_EMAIL),
				},
				{
					value: ReportField.STUDENT_COURSE,
					content: _("report_fields." + ReportField.STUDENT_COURSE),
				},
				{
					value: ReportField.SCORE,
					content: _("report_fields." + ReportField.SCORE),
				},
				{
					value: ReportField.EXERCISES_LABEL,
					content: _("report_fields." + ReportField.EXERCISES_LABEL),
				},
				{
					value: ReportField.EXERCISES_ANSWER,
					content: _("report_fields." + ReportField.EXERCISES_ANSWER),
				},
				{
					value: ReportField.EXERCISES_SCORE,
					content: _("report_fields." + ReportField.EXERCISES_SCORE),
				},
			];
		},
	},
});
</script>

<style></style>
