<template>
  <div>
    <Btn
      @click="getParticipationsAsCsv"
      :outline="true"
      :disabled="(eventParticipations?.length ?? 0) === 0"
      ><span class="material-icons-outlined mr-1"> file_download </span
      >{{ $t("misc.download_as_csv") }}</Btn
    >
  </div>
</template>

<script lang="ts">
import { loadingMixin } from "@/mixins";
import { getParticipationsAsCsv } from "@/reports/csv";
import { forceFileDownload } from "@/utils";
import { defineComponent, PropType } from "@vue/runtime-core";
import { createNamespacedHelpers } from "vuex";
import Btn from "../ui/Btn.vue";
const { mapState } = createNamespacedHelpers("teacher");

export default defineComponent({
  name: "CsvParticipationDownloader",
  props: {},
  mixins: [loadingMixin],
  components: { Btn },
  methods: {
    async getParticipationsAsCsv() {
      await this.withLoading(() =>
        forceFileDownload(
          { data: getParticipationsAsCsv(this.eventParticipations) },
          this.eventParticipations[0]?.event.name + ".csv"
        )
      );
    },
  },
  computed: {
    ...mapState(["eventParticipations"]),
  },
});
</script>

<style></style>
