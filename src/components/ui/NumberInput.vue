<template>
  <div
    class="light-input relative transition-border duration-300 relative z-10 px-2 py-1.5 bg-light border-b-2 rounded-t-sm focus-within:border-primary"
  >
    <input
      type="number"
      placeholder=" "
      :value="modelValue"
      @input="$emit('update:modelValue', $event.target.value)"
      class="z-10 block w-full bg-transparent appearance-none floating-label focus:outline-none"
      :class="{ 'pl-5': leftIcon.length > 0 }"
    />
    <label class="absolute bottom-1.5 origin-0 -z-1"><slot></slot></label>
    <div v-if="rightIcon.length > 0" class="absolute bottom-0.5 right-1.5 -z-1">
      <span class="text-base text-muted material-icons-outlined">
        {{ rightIcon }}
      </span>
    </div>
    <div v-if="leftIcon.length > 0" style="bottom: 3.2px" class="absolute left-1.5 -z-1">
      <span class="text-base text-muted material-icons-outlined">
        {{ leftIcon }}
      </span>
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
  },
});
</script>
