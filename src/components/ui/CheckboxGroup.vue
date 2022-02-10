<template>
  <div>
    <label
      :class="'flex space-x-1.5 items-start ' + optionClass"
      v-for="(option, index) in options"
      :key="id + '-option-' + index"
      :for="id + '-option-' + index"
    >
      <div class="flex flex-col w-full">
        <div class="flex w-full">
          <input
            v-if="!useToggles"
            :disabled="disabled"
            :id="id + '-option-' + index"
            type="checkbox"
            v-model="proxyModelValue"
            :value="option.value"
            class="mr-2 mt-5px"
          />
          <Toggle
            v-else
            class="order-1 mt-1 ml-4"
            :modelValue="proxyModelValue.includes(option.value)"
            @update:modelValue="onToggleUpdate($event, option)"
          ></Toggle>
          <slot v-bind:icons="option.icons"></slot>
          <p :class="labelClass" v-html="option.content"></p>
        </div>
        <!-- <p
          class="mb-2 text-sm text-muted"
          v-if="(option.description?.length ?? 0) > 0"
          v-html="option.description"
        ></p> -->
        <slot v-bind:description="option.description"></slot>
      </div>
    </label>
  </div>
</template>

<script lang="ts">
import { SelectableOption } from '@/interfaces'
import { defineComponent, PropType } from '@vue/runtime-core'
import { v4 as uuid4 } from 'uuid'
import Toggle from './Toggle.vue'

export default defineComponent({
  components: { Toggle },
  name: 'CheckboxGroup',
  //props: ['options', 'modelValue', 'disabled'],
  props: {
    options: {
      type: Object as PropType<SelectableOption[]>,
      required: true
    },
    modelValue: {
      type: Array as PropType<unknown[]>,
      required: true
    },
    disabled: {
      type: Boolean,
      default: false
    },
    labelClass: {
      type: String,
      default: ''
    },
    optionClass: {
      type: String,
      default: ''
    },
    useToggles: {
      type: Boolean,
      default: false
    }
  },
  created () {
    this.id = uuid4()
  },
  data () {
    return {
      id: ''
    }
  },
  methods: {
    onToggleUpdate (event: unknown, option: SelectableOption) {
      console.log(event, option)
      if (event) {
        // new selection
        this.proxyModelValue = [...this.proxyModelValue, option.value]
      } else {
        // deselection
        this.proxyModelValue = this.proxyModelValue.filter(
          v => v !== option.value
        )
      }
    }
  },
  computed: {
    proxyModelValue: {
      get (): unknown[] {
        return this.modelValue
      },
      set (val: Array<{ value: string; content: string }>) {
        // TODO make interface
        this.$emit('update:modelValue', val)
      }
    }
  }
})
</script>

<style></style>
