<template>
  <div
    :class="{
      'border-danger-dark focus-within:border-danger-dark': $slots.errors,
    }"
    class="
      light-input
      transition-border
      duration-300
      relative
      z-10
      px-2
      py-1.5
      bg-light
      border-b-2
      rounded-t-sm
      focus-within:border-primary
    "
  >
    <input
      type="number"
      :min="min"
      :max="max"
      placeholder=" "
      :value="modelValue"
      @input="onInput($event.target.value)"
      class="z-10 block w-full bg-transparent appearance-none  floating-label focus:outline-none"
      :class="{
        'pl-5': leftIcon.length > 0,
        'floating-label-error': $slots.errors?.(),
      }"
    />
    <label class="absolute bottom-1.5 origin-0 -z-1">
      <slot></slot>
    </label>
    <div v-if="rightIcon.length > 0" class="absolute bottom-0.5 right-1.5 -z-1">
      <span class="text-base text-muted material-icons-outlined">
        {{ rightIcon }}
      </span>
    </div>
    <div
      v-if="$slots.rightHint"
      class="absolute z-10 -mb-1.25px opacity-70 bottom-2 text-muted right-7"
    >
      <slot name="rightHint"></slot>
    </div>
    <div
      v-if="leftIcon.length > 0"
      style="bottom: 3.2px"
      class="absolute left-1.5 -z-1"
    >
      <span class="text-base text-muted material-icons-outlined">
        {{ leftIcon }}
      </span>
    </div>
    <div
      v-if="$slots.errors?.()"
      class="hidden text-sm font-light text-danger-dark"
    >
      <slot name="errors"></slot>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "@vue/runtime-core";

export default defineComponent({
  name: "NumberInput",
  props: {
    modelValue: {
      type: [Number, String],
      required: true,
    },
    rightIcon: {
      type: String,
      default: "",
    },
    leftIcon: {
      type: String,
      default: "",
    },
    min: {
      type: Number,
      default: -1000000000,
    },
    max: {
      type: Number,
      default: 1000000000,
    },
  },
  methods: {
    onInput(value: string) {
      //console.log(String(value));
      this.$emit("update:modelValue", value);
    },
  },
});
</script>
