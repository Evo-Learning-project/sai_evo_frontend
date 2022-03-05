<template>
  <div class="relative">
    <label class="absolute top-2 left-1.5 origin-0 fixed-label"><slot></slot></label>

    <div class="w-full">
      <label
        :for="id + '-input-' + index"
        class="flex my-0.5 max-h-screen space-x-1.5 overflow-y-hidden cursor-pointer items-top"
        v-for="(option, index) in options"
        :key="id + '-option-' + index"
      >
        <input
          @input="onInput(option.value, $event)"
          style="min-width: 15px; min-height: 15px"
          class="mt-1.5"
          type="radio"
          :id="id + '-input-' + index"
          :value="option.value"
          :checked="option.value == modelValue"
          :disabled="disabled"
        />
        <div class="flex space-x-2 items-top">
          <multi-icon v-if="option.icons" class="w-6" :icons="option.icons"></multi-icon>
          <div class="flex flex-col">
            <p class="" v-html="option.content"></p>
            <!-- <p
              class="mb-2 text-sm text-muted"
              v-if="(option.description?.length ?? 0) > 0"
              v-html="option.description"
            ></p> -->
            <slot v-bind:description="option.description"></slot>
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

export default defineComponent({
  name: "RadioGroup",
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
