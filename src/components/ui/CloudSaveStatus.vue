<template>
  <div>
    <div class="w-0 h-8 opacity-0" v-if="showOutOfViewFeedback">&nbsp;</div>
    <div
      class=""
      :id="elementId"
      :class="{
        'fixed top-18 right-8 z-999  px-2 pt-1.5 pb-1 shadow-all-around  pr-2 rounded-full':
          showOutOfViewFeedback,
        'opacity-0': showOutOfViewFeedback && !fadingOutOfViewFeedback,
        'opacity-50 transition-opacity duration-100 delay-75':
          fadingOutOfViewFeedback,
        'h-8': !showOutOfViewFeedback,
      }"
    >
      <div
        v-if="saving"
        class="flex items-center ml-auto space-x-1.5 text-muted"
      >
        <!-- <Spinner :size="'sm'"></Spinner> -->
        <span class="text-xl opacity-80 material-icons-outlined animate-spin">
          sync
        </span>
        <p class="text-base">{{ $t("cloud.saving") }}</p>
      </div>
      <div
        v-else-if="!hadError"
        class="flex items-center ml-auto space-x-1.5 text-muted"
      >
        <Tooltip
          :placement="'left'"
          :text-value="$t('cloud.changes_saved_to_server')"
        >
          <span
            :class="{
              'tooltip-handle hover:bg-light hover:bg-opacity-100 rounded px-1.5  transition-colors duration-100':
                !showSaved,
            }"
            class="text-xl cursor-default select-none  opacity-80 material-icons-outlined hover:text-primary"
          >
            cloud_done
          </span>
        </Tooltip>

        <!--<div class="tooltip">
        <span
          :class="{
            'tooltip-handle hover:bg-gray-200 hover:bg-opacity-80 rounded-md px-1.5  transition-colors duration-100': !showSaved,
          }"
          class="text-base cursor-default select-none opacity-80 material-icons-outlined hover:text-primary-dark"
        >
          cloud_done
        </span>
        <span class="tooltip-text tooltip-left">{{
          $t("cloud.changes_saved_to_server")
        }}</span>
      </div>-->
        <p v-if="showSaved" class="mb-0.5 text-base">
          {{ $t("cloud.saved") }}
        </p>
      </div>
      <div v-else>
        <div
          class="flex items-center space-x-1 text-sm  text-muted text-danger-dark"
        >
          <span class="text-sm material-icons-outlined">error_outline</span>
          <span class="">{{ $t("cloud.error") }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "@vue/runtime-core";
import Tooltip from "./Tooltip.vue";
import { v4 as uuid4 } from "uuid";
export default defineComponent({
  components: {
    Tooltip,
  },
  name: "CloudSaveStatus",
  props: {
    saving: {
      type: Boolean,
      required: true,
    },
    hadError: {
      type: Boolean,
      default: false,
    },
  },
  watch: {
    saving(newVal: boolean, oldVal: boolean) {
      if (newVal && this.showOutOfViewFeedbackHandle !== null) {
        clearTimeout(this.showOutOfViewFeedbackHandle);
      }

      if (!newVal && oldVal) {
        // done saving
        if (this.showSavedHandle !== null) {
          clearTimeout(this.showSavedHandle);
        }
        this.showSaved = true;
        this.showSavedHandle = setTimeout(() => {
          this.showSaved = false;
        }, 5000);
        this.showOutOfViewFeedbackHandle = setTimeout(() => {
          this.showOutOfViewFeedback = false;
          this.fadingOutOfViewFeedback = false;
        }, 1000);
      }
      if (newVal && !this.isElementInViewPort()) {
        this.showOutOfViewFeedback = true;
        setTimeout(() => (this.fadingOutOfViewFeedback = true), 201);
      }
    },
  },
  data() {
    return {
      showSaved: false,
      elementId: uuid4(),
      showOutOfViewFeedback: false,
      fadingOutOfViewFeedback: false,
      showSavedHandle: null as number | null,
      showOutOfViewFeedbackHandle: null as number | null,
    };
  },
  methods: {
    isElementInViewPort() {
      const element = document.getElementById(this.elementId) as HTMLElement;
      const rect = element.getBoundingClientRect();

      return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <=
          (window.innerHeight ||
            document.documentElement
              .clientHeight) /* or $(window).height() */ &&
        rect.right <=
          (window.innerWidth || document.documentElement.clientWidth)
      ); /* or $(window).width() */
    },
  },
});
</script>
<style scoped></style>
