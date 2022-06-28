<template>
  <transition name="fade" v-show="showDialog" appear>
    <!--@after-enter="showContent = true"-->
    <!--@after-leave="$emit(choice)"-->
    <div
      style="z-index: 1000"
      class="fixed top-0 left-0 flex items-center justify-center w-full h-full"
    >
      <div
        @click="dismiss()"
        style="width: 100vw !important; height: 100vh !important"
        class="absolute z-10 w-full h-full transition-none bg-gray-900  opacity-80"
      ></div>
      <transition name="bounce">
        <div
          v-if="showDialog"
          class="
            z-20
            max-h-full
            overflow-y-auto
            mx-1.5
            bg-white
            rounded-md
            shadow-all-around
            md:mx-0
          "
          :class="{
            'md:max-w-4xl md:min-w-md': !large,
            'md:w-full md:mx-4': large,
          }"
        >
          <div
            style=""
            class="w-full overflow-y-auto"
            :class="{ 'px-4 py-6 md:px-8': !noPadding }"
          >
            <!-- overflow-y-auto-->
            <div v-if="$slots.title" class="flex items-center mb-2 space-x-2">
              <slot class="" name="backButton"></slot>
              <div v-if="error">
                <div class="icon-surrounding bg-danger-light text-danger-dark">
                  <span class="material-icons-outlined"> priority_high </span>
                </div>
              </div>
              <div v-else-if="warning">
                <div class="text-yellow-900 bg-yellow-500 icon-surrounding">
                  <span class="ml-px material-icons-outlined">
                    priority_high
                  </span>
                </div>
              </div>
              <div v-else-if="success">
                <div
                  class="icon-surrounding bg-success-light text-success-dark"
                >
                  <span class="material-icons-outlined"> check </span>
                </div>
              </div>
              <h2 class="mb-0">
                <slot name="title"></slot>
              </h2>
            </div>
            <div class="text-gray-600">
              <slot name="body"></slot>
            </div>
          </div>

          <div
            class="flex flex-col pt-5 pb-4 pr-2 md:flex-row"
            :class="{
              'border-t border-gray-200': footerBorder,
            }"
          >
            <div class="mt-auto"><slot name="footerButtons"></slot></div>
            <div class="flex ml-auto">
              <Btn
                @click="emitChoice('yes')"
                :variant="'primary-borderless'"
                :disabled="disableOk"
              >
                {{
                  yesText ||
                  (confirmOnly
                    ? $t("dialog.default_ok_text")
                    : $t("dialog.default_yes_text"))
                }}
              </Btn>
              <Btn
                v-if="!confirmOnly"
                @click="emitChoice('no')"
                :variant="'primary-borderless'"
              >
                {{ noText || $t("dialog.default_no_text") }}
              </Btn>
            </div>
          </div>
        </div>
      </transition>
    </div>
  </transition>
</template>

<script lang="ts">
import { defineComponent } from "@vue/runtime-core";
import Btn from "@/components/ui/Btn.vue";
export default defineComponent({
  name: "Dialog",
  props: {
    title: String,
    showDialog: {
      type: Boolean,
      required: true,
    },
    large: {
      type: Boolean,
      default: false,
    },
    dismissible: {
      type: Boolean,
      default: true,
    },
    severity: {
      type: Number,
      default: 1,
    },
    yesText: {
      type: String,
      default: "",
    },
    noText: {
      type: String,
      default: "",
    },
    error: {
      type: Boolean,
      default: false,
    },
    warning: {
      type: Boolean,
      default: false,
    },
    success: {
      type: Boolean,
      default: false,
    },
    footerBorder: {
      type: Boolean,
      default: false,
    },
    noPadding: {
      type: Boolean,
      default: false,
    },
    confirmOnly: Boolean,
    disableOk: Boolean,
  },
  components: {
    Btn,
  },
  beforeUnmount() {
    const bodyContainsOverflowHidden =
      document.body.classList.contains("overflow-y-hidden");
    if (bodyContainsOverflowHidden) {
      document.body.classList.remove("overflow-y-hidden");
    }
  },
  watch: {
    showDialog(newVal) {
      // prevent scrolling of the underlying page when dialog is open
      const bodyContainsOverflowHidden =
        document.body.classList.contains("overflow-y-hidden");

      if (newVal && !bodyContainsOverflowHidden) {
        document.body.classList.add("overflow-y-hidden");
      } else if (!newVal && bodyContainsOverflowHidden) {
        document.body.classList.remove("overflow-y-hidden");
      }
    },
  },
  created() {
    setTimeout(() => (this.showContent = true), 0);
  },
  data() {
    return {
      choice: "",
      showContent: false,
    };
  },
  methods: {
    emitChoice(choice: string) {
      //   this.choice = choice
      //   this.showContent = false
      console.log("emitting", choice);
      this.$emit(choice);
    },
    dismiss() {
      if (!this.dismissible) {
        return;
      }
      this.emitChoice(this.confirmOnly ? "yes" : "no");
    },
  },
});
</script>

<style></style>
