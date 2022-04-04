<template>
  <div class="relative">
    <label class="absolute top-2 left-3 origin-0 fixed-label"><slot></slot></label>

    <div class="flex w-full">
      <label
        @mousedown="onMouseDown"
        :for="id + '-input-' + index"
        class="flex flex-grow text-center min-w-fit overflow-ellipsis whitespace-nowrap text-gray-600 font-semibold relative overflow-hidden max-h-screen py-1.5 px-2 overflow-y-hidden overflow-x-hidden rounded-md cursor-pointer items-top"
        :class="{
          'rounded-r-none': index < options.length - 1,
          'rounded-l-none': index !== 0,
          'border border-primary bg-primary bg-opacity-20 text-primary ':
            option.value == modelValue,
          'border hover:text-gray-800 hover:bg-light': option.value != modelValue,
        }"
        v-for="(option, index) in options"
        :key="id + '-option-' + index"
      >
        <input
          @input="onInput(option.value, $event)"
          class="invisible w-0 h-0"
          type="radio"
          :id="id + '-input-' + index"
          :value="option.value"
          :checked="option.value == modelValue"
          :disabled="disabled"
        />
        <div class="flex mx-auto space-x-2 items-top">
          <multi-icon v-if="option.icons" class="w-6" :icons="option.icons"></multi-icon>
          <div class="flex flex-col">
            <p class="" v-html="option.content"></p>
            <!-- <p
              class="mb-2 text-sm text-muted"
              v-if="(option.description?.length ?? 0) > 0"
              v-html="option.description"
            ></p> -->
            <!-- <slot v-bind:description="option.description"></slot> -->
          </div>
        </div>
      </label>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "@vue/runtime-core";
import { v4 as uuid4 } from "uuid";
import MultiIcon from "@/components/ui/MultiIcon.vue";
import { rippleEffect } from "@/utils";

export default defineComponent({
  name: "SegmentedControls",
  props: ["options", "modelValue", "disabled"],
  components: {
    MultiIcon,
  },
  created() {
    this.id = uuid4();
  },
  data() {
    return {
      showFeedback: false,
      id: "",
    };
  },
  methods: {
    onMouseDown(event: any) {
      rippleEffect(event, "ripple-primary");
    },
    onInput(value: string, inputEvent: Event) {
      // eslint-disable-next-line @typescript-eslint/no-extra-semi
      ((inputEvent.target as unknown) as { checked: boolean }).checked = false;
      inputEvent.preventDefault();
      this.$emit("update:modelValue", value);
    },
  },
});
</script>

<style></style>
