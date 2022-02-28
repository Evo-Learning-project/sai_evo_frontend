<template>
  <div>
    <div class="flex mt-6 mb-6 space-x-4">
      <TextInput
        class="w-full mr-auto"
        :modelValue="modelValue.name"
        @update:modelValue="emitUpdate('name', $event)"
        >{{ $t("event_editor.name") }}</TextInput
      >
      <CalendarInput
        class=""
        :modelValue="modelValue.begin_timestamp"
        ref="beginTimestampElement"
        @open="onBeginTimestampOpen()"
        @update:modelValue="
          isDraft ? emitUpdate('begin_timestamp', $event) : () => null
        "
        >{{ $t("event_editor.begin_timestamp") }}</CalendarInput
      >
      <CalendarInput
        class=""
        :modelValue="modelValue.end_timestamp"
        @update:modelValue="emitUpdate('end_timestamp', $event)"
        >{{ $t("event_editor.end_timestamp") }}</CalendarInput
      >
    </div>
    <TextEditor
      :modelValue="modelValue.instructions"
      @update:modelValue="emitUpdate('instructions', $event)"
    >
      {{ $t("event_editor.instructions") }}</TextEditor
    >
    <div class="flex flex-col mt-12 space-y-4">
      <h3>{{ $t("event_editor.flow_rules") }}</h3>
      <div class="flex items-center space-x-4">
        <RadioGroup
          :modelValue="modelValue.exercises_shown_at_a_time"
          :options="exercisesShownAtOnceOptions"
          @update:modelValue="emitUpdate('exercises_shown_at_a_time', $event)"
        ></RadioGroup>
      </div>
      <toggle
        :labelOnLeft="true"
        v-show="modelValue.exercises_shown_at_a_time == 1"
        :modelValue="modelValue.allow_going_back"
        @update:modelValue="emitUpdate('allow_going_back', $event)"
        >{{ $t("event_editor.allow_going_back_label") }}</toggle
      >
    </div>
    <Dialog
      @yes="showDialog = false"
      :showDialog="showDialog"
      :confirmOnly="true"
    >
      <template v-slot:body>
        {{ $t("event_editor.cannot_change_timestamp") }}
      </template>
    </Dialog>
  </div>
</template>

<script lang="ts">
/* eslint-disable @typescript-eslint/no-extra-semi */

import CalendarInput from "@/components/ui/CalendarInput.vue";
import TextInput from "@/components/ui/TextInput.vue";
import TextEditor from "@/components/ui/TextEditor.vue";
import { defineComponent } from "@vue/runtime-core";
import { Event, EventState } from "@/models";
import Toggle from "@/components/ui/Toggle.vue";
//import NumberInput from '@/components/ui/NumberInput.vue'
import { PropType } from "vue";
//import Btn from '@/components/ui/Btn.vue'
import RadioGroup from "@/components/ui/RadioGroup.vue";
import { getTranslatedString as _ } from "@/i18n";
import Dialog from "@/components/ui/Dialog.vue";
import { SelectableOption } from "@/interfaces";

export default defineComponent({
  name: "EventMetaEditor",
  components: {
    CalendarInput,
    TextInput,
    TextEditor,
    Toggle,
    //NumberInput,
    //Btn,
    RadioGroup,
    Dialog,
  },
  props: {
    modelValue: {
      type: Object as PropType<Event>,
      required: true,
    },
  },
  // created () {
  //   this.event = this.modelValue
  // },
  // watch: {
  //   serializedModelValue (newVal: string) {
  //     this.$emit('update:modelValue', JSON.parse(newVal))
  //   }
  // },
  data() {
    return {
      event: {} as Event,
      saving: false,
      showDialog: false,
    };
  },
  methods: {
    emitUpdate(key: keyof Event, value: unknown) {
      this.$emit("updateEvent", { field: key, value });
      // console.log(key, value)
      // this.$emit('update:modelValue', {
      //   ...this.modelValue,
      //   [key]: value
      // })
    },
    onBeginTimestampOpen() {
      if (this.modelValue.state != EventState.DRAFT) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (this.$refs.beginTimestampElement as any).close();
        this.showDialog = true;
      }
    },
  },
  computed: {
    isDraft() {
      return this.modelValue.state == EventState.DRAFT;
    },
    exercisesShownAtOnceOptions(): SelectableOption[] {
      return [
        {
          value: null,
          content: _("event_editor.show_all_exercises_at_once"),
        },
        {
          value: 1,
          content: _("event_editor.show_one_exercise_at_once"),
        },
      ];
    },
  },
});
</script>

<style></style>
