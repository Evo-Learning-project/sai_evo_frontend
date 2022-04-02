<template>
  <div class="relative">
    <label class="absolute top-2 left-1.5 origin-0 fixed-label"
      ><slot></slot
    ></label>
    <div
      :class="{
        'max-h-20 hover:shadow-md': !expanded,
        'max-h-screen shadow-popup': expanded,
      }"
      class="flex overflow-y-hidden transition-all duration-300 ease-in-out border border-gray-300 rounded-md "
    >
      <div class="w-full">
        <label
          :for="id + '-input-' + index"
          :class="{
            'transition-colors duration-200 ease-in-out': !expanded,
            'bg-primary  text-lightText':
              option.value == modelValue && (expanded || showFeedback),
            'rounded-md px-2.5 py-1.5': option.value == modelValue,
            'h-0 py-0 overflow-hidden opacity-0':
              modelValue != null && option.value != modelValue && !expanded,
            'px-2.5 py-1.5': modelValue == null || expanded,
            'hover:bg-light':
              modelValue != option.value || (!expanded && !showFeedback),
          }"
          class="flex items-center max-h-screen overflow-y-hidden cursor-pointer "
          v-for="(option, index) in options"
          :key="id + '-option-' + index"
        >
          <input
            @click="onClick(option.value)"
            @input="onInput(option.value, $event)"
            class="w-0 h-0 opacity-0"
            type="radio"
            :id="id + '-input-' + index"
            :value="option.value"
            :checked="option.value == modelValue"
          />
          <div class="flex space-x-2 items-top">
            <multi-icon class="w-6" :icons="option.icons"></multi-icon>
            <div>
              <p v-html="option.content"></p>
              <p
                v-if="option.description && expanded"
                v-html="option.description"
                :class="[
                  option.value == modelValue
                    ? 'text-light font-light'
                    : 'text-muted',
                  'text-sm my-1 -ml-6',
                ]"
              ></p>
            </div>
          </div>
          <span
            v-if="index == 0 || !expanded"
            class="-mb-0.5 ml-auto material-icons-outlined"
            >expand_more</span
          >
        </label>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "@vue/runtime-core";
import { v4 as uuid4 } from "uuid";
import MultiIcon from "@/components/ui/MultiIcon.vue";

export default defineComponent({
  name: "Dropdown",
  props: ["options", "modelValue"],
  components: {
    MultiIcon,
  },
  created() {
    this.id = uuid4();
    if (this.modelValue != null) {
      this.expanded = false;
    }
  },
  data() {
    return {
      expanded: true,
      showFeedback: false,
      id: "",
    };
  },
  methods: {
    onInput(value: string, inputEvent: Event) {
      console.log("INPUT", value);

      if (this.modelValue != value) {
        this.expanded = false;
        this.showFeedback = true;
        setTimeout(() => (this.showFeedback = false), 1000);
      }

      // prevent target from automatically being checked -
      // it will if its value is equal to modelValue

      // eslint-disable-next-line @typescript-eslint/no-extra-semi
      (inputEvent.target as unknown as { checked: boolean }).checked = false;
      inputEvent.preventDefault();
      this.$emit("update:modelValue", value);
    },
    onChange(value: string, changeEvent: Event) {
      console.log(changeEvent);

      if (this.modelValue != value) {
        this.expanded = false;
        this.showFeedback = true;
        setTimeout(() => (this.showFeedback = false), 1000);
      }
      this.$emit("update:modelValue", value);
    },
    onClick(value: string) {
      if (
        this.modelValue != null &&
        value == this.modelValue &&
        !this.expanded
      ) {
        this.expanded = true;
      } else if (this.modelValue == value && this.expanded) {
        this.expanded = false;
      }
    },
  },
});
</script>

<style></style>
