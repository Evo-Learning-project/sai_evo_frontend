<template>
  <div>
    <div
      :class="{
        'border-danger-dark focus-within:border-danger-dark': $slots.errors,
      }"
      class="
        light-input
        relative
        z-10
        px-2
        py-1.5
        bg-light
        border-b-2
        rounded-t-sm
        focus-within:border-primary
        transition-border
        duration-300
      "
    >
      <input
        type="text"
        :value="modelValue"
        @input="$emit('update:modelValue', $event.target.value)"
        :placeholder="placeholder"
        :class="{
          'floating-label-error': $slots.errors?.(),
          'floating-label': !fixedLabel,
        }"
        class="z-10 block w-full bg-transparent appearance-none  focus:outline-none"
      />
      <label
        :class="{ 'top-2 left-1.5 origin-0 fixed-label': fixedLabel }"
        class="absolute bottom-1.5 origin-0 -z-1"
      >
        <slot></slot>
      </label>
      <div
        v-if="rightIcon.length > 0"
        class="absolute bottom-0.5 right-1.5 -z-1"
      >
        <span class="text-base text-muted material-icons-outlined">
          {{ rightIcon }}
        </span>
      </div>
    </div>
    <div v-if="$slots.errors?.()" class="text-sm font-light text-danger-dark">
      <slot name="errors"></slot>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "@vue/runtime-core";

export default defineComponent({
  name: "TextInput",
  props: {
    modelValue: {
      type: String,
      required: true,
    },
    rightIcon: {
      type: String,
      default: "",
    },
    placeholder: {
      type: String,
      default: " ",
    },
    fixedLabel: {
      type: Boolean,
      default: false,
    },
  },
});
</script>
