<template>
  <div>
    <Btn
      @click="getParticipationsAsCsv"
      :outline="true"
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
const { mapState, mapActions } = createNamespacedHelpers("teacher");

export default defineComponent({
  name: "CsvParticipationDownloader",
  props: {},
  mixins: [loadingMixin, courseIdMixin, eventIdMixin],
  components: { Btn },
  methods: {
    ...mapActions(["getEventParticipations"]),
    async getParticipationsAsCsv() {
      await this.withLoading(async () => {
        await this.getEventParticipations({
          courseId: this.courseId,
          eventId: this.eventId,
          preview: false,
        });
        forceFileDownload(
          {
            data: getParticipationsAsCsv(this.eventParticipations).replace(
              /\\n/g,
              "\n"
            ),
          },
          this.eventParticipations[0]?.event.name + ".csv"
        );
      });
    },
  },
  computed: {
    ...mapState(["eventParticipations"]),
  },
});
</script>

<style></style>
