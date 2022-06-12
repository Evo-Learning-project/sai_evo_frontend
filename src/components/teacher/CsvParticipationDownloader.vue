<template>
  <div>
    <Btn
      @click="showDialog = true"
      :outline="true"
      :loading="loadingCsv"
      :disabled="(eventParticipations?.length ?? 0) === 0"
      ><span class="mr-1 material-icons-outlined"> file_download </span
      >{{ $t("misc.download_as_csv") }}</Btn
    >
    <Dialog
      :showDialog="showDialog"
      :confirmOnly="true"
      :yesText="$t('dialog.default_cancel_text')"
      @yes="showDialog = false"
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
          <RadioGroup
            v-model="selectedDownloadPreset"
            :options="presetsAsOptions"
          >
            <template v-slot:item="{ description }">
              <div class="flex items-center mb-2 space-x-2">
                <p class="text-sm text-muted">{{ description }}</p>
              </div></template
            >
          </RadioGroup>
          <div
            v-if="selectedDownloadPreset === ReportSettingsPreset.CUSTOM"
            class="mt-4 mb-12 ml-7"
          >
            <CheckboxGroup
              :options="fieldsAsOptions"
              class="grid grid-cols-4 gap-y-2"
              @update:modelValue="
                downloadSettingsProxy = {
                  ...downloadSettingsProxy,
                  fields: $event,
                }
              "
              :modelValue="downloadSettingsProxy.fields"
            ></CheckboxGroup>
          </div>
          <div class="flex items-center mt-12 space-x-2 w-44">
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
        localStorage.getItem(LOCAL_STORAGE_SETTINGS_KEY) as string
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
  },
  data() {
    return {
      loadingCsv: false,
      showDialog: false,
      downloadSettings: null as ReportSettings | null,
      selectedDownloadPreset: ReportSettingsPreset.MAT_AND_SCORES,
      availablePresets: getPresets(),
      reportType: ReportType.CSV,
      ReportSettingsPreset,
    };
  },
  methods: {
    ...mapActions(["getEventParticipations"]),
    async getParticipationsAsCsv() {
      this.loadingCsv = true;
      try {
        await this.getEventParticipations({
          courseId: this.courseId,
          eventId: this.eventId,
          includeDetails: true,
          forCsv: true,
        });
        forceFileDownload(
          {
            data: getParticipationsAsCsv(this.eventParticipations).replace(
              /(\\r)?\\n/g,
              "\n"
            ),
          },
          this.event(this.eventId).name + ".csv"
        );
      } catch (e) {
        this.setErrorNotification(e);
      } finally {
        this.loadingCsv = false;
      }
    },
  },
  computed: {
    ...mapState(["eventParticipations"]),
    ...mapGetters(["event"]),
    settingsAsJson(): string {
      return JSON.stringify({
        reportType: this.reportType,
        selectedDownloadPreset: this.selectedDownloadPreset,
        [CUSTOM_SETTINGS_KEY]:
          this.availablePresets[ReportSettingsPreset.CUSTOM],
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
