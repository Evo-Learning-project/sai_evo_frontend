<template>
  <div>
    <Dialog
      :footerBorder="true"
      :fullHeight="true"
      :large="true"
      :noPadding="true"
      @yes="$emit('hide')"
      :confirmOnly="true"
      :showDialog="show"
    >
      <template v-slot:body>
        <div class="relative">
          <div class="sticky top-0 z-50 px-8 pt-4 pb-4 bg-white shadow-sm">
            <SegmentedControls
              :options="instancesAsSelectableOptions"
              v-model="currentInstance"
            >
            </SegmentedControls>
          </div>
          <div>
            <div
              style="max-height: 70vh"
              class="px-8 overflow-y-auto"
              v-show="instanceIndex === currentInstance"
              v-for="(_, instanceIndex) in instances"
              :key="'instance-' + instanceIndex"
            >
              <div
                class="my-12"
                v-for="(__, slotIndex) in instances[instanceIndex]"
                :key="'instance-' + instanceIndex + '-slot-' + slotIndex"
              >
                <h4 class="mb-1">
                  {{ $t("event_participation_page.exercise") }}
                  {{ slotIndex + 1 }}
                </h4>
                <AbstractEventParticipationSlot
                  :allow-edit-assessment="false"
                  :allow-edit-submission="false"
                  :modelValue="instancesAsSlotArrays[instanceIndex][slotIndex]"
                ></AbstractEventParticipationSlot>
              </div>
            </div>
          </div>
        </div>
      </template>
    </Dialog>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from "@vue/runtime-core";
import Dialog from "@/components/ui/Dialog.vue";
import {
  EventParticipationSlot,
  Exercise,
  getFakeEventParticipationSlot,
} from "@/models";
import { SelectableOption } from "@/interfaces";
import SegmentedControls from "@/components/ui/SegmentedControls.vue";
import AbstractEventParticipationSlot from "@/components/shared/AbstractEventParticipationSlot.vue";
import { getTranslatedString as _ } from "@/i18n";
export default defineComponent({
  name: "EventInstancesPreview",
  components: { Dialog, SegmentedControls, AbstractEventParticipationSlot },
  props: {
    show: {
      type: Boolean,
      required: true,
    },
    instances: {
      type: Array as PropType<Exercise[][]>,
      required: true,
    },
  },
  data() {
    return {
      currentInstance: 0 as number,
    };
  },
  methods: {},
  computed: {
    instancesAsSlotArrays(): EventParticipationSlot[][] {
      return this.instances.map((i) =>
        i.map((e) => getFakeEventParticipationSlot(e))
      );
    },
    instancesAsSelectableOptions(): SelectableOption[] {
      return this.instances.map((i, j) => ({
        value: j,
        content: _("misc.example") + " " + (j + 1),
      }));
    },
  },
});
</script>

<style></style>
