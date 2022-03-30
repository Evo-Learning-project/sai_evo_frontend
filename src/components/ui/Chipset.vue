<template>
  <div class="flex flex-wrap p-1">
    <div
      class="cursor-pointer chip hover:bg-gray-200 font-normal transition-colors duration-75 ease-linear"
      v-for="(option, index) in options"
      :key="'chipset-' + id + '-option-' + index"
      :class="{
        'chip-primary': modelValue.includes(option.value),
      }"
    >
      <!-- ring-primary ring-2 text-primary font-semibold -->
      <input
        :type="allowMultiple ? 'checkbox' : 'radio'"
        class="w-0 h-0 opacity-0"
        v-model="proxyModelValue"
        :id="'chipset-' + id + '-option-' + index"
        :value="option.value"
      />
      <label
        class="flex items-center cursor-pointer"
        :for="'chipset-' + id + '-option-' + index"
      >
        <MultiIcon v-if="option.icons" class="w-6 mr-1" :icons="option.icons"></MultiIcon>
        <p v-html="option.content"></p
      ></label>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "@vue/runtime-core";
import MultiIcon from "@/components/ui/MultiIcon.vue";

import { v4 as uuid4 } from "uuid";
export default defineComponent({
  name: "Chipset",
  props: {
    modelValue: Array,
    value: {
      default: null,
    },
    options: Array,
    allowMultiple: {
      type: Boolean,
      default: true,
    },
  },
  components: {
    MultiIcon,
  },
  created() {
    this.id = uuid4();
  },
  data() {
    return {
      id: "",
    };
  },
  computed: {
    proxyModelValue: {
      get() {
        return this.modelValue;
      },
      set(val: unknown) {
        this.$emit(
          "update:modelValue",
          this.allowMultiple ? val : val === this.modelValue?.[0] ? [] : [val]
        );
      },
    },
  },
});
</script>
