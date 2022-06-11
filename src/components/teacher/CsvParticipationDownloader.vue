<template>
  <div>
    <Btn
      @click="getParticipationsAsCsv"
      :outline="true"
      :loading="loadingCsv"
      :disabled="(eventParticipations?.length ?? 0) === 0"
      ><span class="mr-1 material-icons-outlined"> file_download </span
      >{{ $t("misc.download_as_csv") }}</Btn
    >
  </div>
</template>

<script lang="ts">
import { courseIdMixin, eventIdMixin, loadingMixin } from "@/mixins";
import { getParticipationsAsCsv } from "@/reports/csv";
import { forceFileDownload } from "@/utils";
import { defineComponent, PropType } from "@vue/runtime-core";
import { createNamespacedHelpers } from "vuex";
import Btn from "../ui/Btn.vue";
const { mapState, mapActions, mapGetters } = createNamespacedHelpers("teacher");

export default defineComponent({
  name: "CsvParticipationDownloader",
  props: {},
  mixins: [loadingMixin, courseIdMixin, eventIdMixin],
  components: { Btn },
  data() {
    return {
      loadingCsv: false,
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
  },
});
</script>

<style></style>
