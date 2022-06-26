<template>
  <div>
    <div v-show="currentStep === 'initial'">
      <h3 class="mb-4">{{ $t("exercise_import.select_format") }}</h3>
      <div class="flex space-x-4">
        <div
          tabindex="0"
          @keydown.enter="onSelect(format.value)"
          @click="onSelect(format.value)"
          v-for="format in dataFormatsAsSelectableOptions"
          :class="{
            'outline-success  hover:bg-opacity-20 outline-4 border-transparent bg-success-light bg-opacity-10':
              selectedFormat === format.value,
            'hover:bg-light': selectedFormat !== format.value,
          }"
          :key="'format-' + format.value"
          v-wave
          class="transition-colors duration-100 card card-border"
        >
          <div class="flex">
            <img
              class="mx-auto pointer-events-none w-18"
              :src="format.description"
            />
          </div>
          <div class="flex mt-4">
            <p class="mx-auto">{{ format.content }}</p>
          </div>
        </div>
      </div>

      <div class="mt-8" v-if="selectedFormat !== null">
        <h3 class="mb-4">{{ $t("exercise_import.choose_file") }}</h3>
        <div>
          <input type="file" @change="onFileInputChange" />
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { getTranslatedString } from "@/i18n";
import { DataFormat, ImportedExerciseData } from "@/integrations";
import { SelectableOption } from "@/interfaces";
import { loadingMixin } from "@/mixins";
import { getFileContent } from "@/utils";
import { defineComponent, PropType } from "@vue/runtime-core";
export default defineComponent({
  name: "ExerciseImporter",
  props: {},
  mixins: [loadingMixin],
  data() {
    return {
      DataFormat,
      selectedFormat: null as DataFormat | null,
      currentStep: "initial" as "initial" | "file_chosen",
    };
  },
  methods: {
    async onFileInputChange(event: { target: HTMLInputElement }) {
      if (event.target.files === null || event.target.files.length === 0) {
        return;
      }
      try {
        const file = event.target.files[0];
        const fileContents = await getFileContent(file);
      } catch (e) {
        this.setErrorNotification(e);
      }
    },
    onSelect(format: DataFormat) {
      if (format === this.selectedFormat) {
        this.selectedFormat = null;
      } else {
        this.selectedFormat = format;
      }
    },
    getImageUrl(imageName: string) {
      console.log("requiring", "../../assets/" + imageName);
      // eslint-disable-next-line no-undef
      return require("@/assets/" + imageName);
    },
  },
  computed: {
    dataFormatsAsSelectableOptions(): SelectableOption[] {
      return [
        {
          value: DataFormat.MOODLE_XML,
          content: getTranslatedString(
            "exercise_import.formats." + DataFormat.MOODLE_XML
          ),
          description: this.getImageUrl("icons/moodle.png"),
        },
        {
          value: DataFormat.EVO_JSON,
          content: getTranslatedString(
            "exercise_import.formats." + DataFormat.EVO_JSON
          ),
          description: this.getImageUrl("icons/json_evo.png"),
        },
      ];
    },
  },
});
</script>

<style></style>
