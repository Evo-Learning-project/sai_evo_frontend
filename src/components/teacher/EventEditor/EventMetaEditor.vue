<template>
  <div>
    <div
      class="flex flex-col mt-6 space-y-4 md:space-x-4 md:flex-row md:space-y-0"
      :class="[
        v$.modelValue.name.$errors.length > 0 ||
        v$.modelValue.begin_timestamp.$errors.length > 0 ||
        v$.modelValue.end_timestamp.$errors.length > 0
          ? 'mb-1'
          : 'mb-6',
      ]"
    >
      <TextInput
        class="w-full md:mr-auto"
        :modelValue="modelValue.name"
        @update:modelValue="emitUpdate('name', $event)"
        >{{ $t("event_editor.name") }}
        <template v-if="v$.modelValue.name.$errors.length > 0" v-slot:errors>
          <div
            class="input-errors"
            v-for="error of v$.modelValue.name.$errors"
            :key="error.$uid"
          >
            <div class="error-msg">
              {{ $t("validation_errors.event." + error.$uid) }}
            </div>
          </div>
        </template>
      </TextInput>
      <CalendarInput
        class=""
        :modelValue="modelValue.begin_timestamp"
        ref="beginTimestampElement"
        @open="onBeginTimestampOpen()"
        @update:modelValue="
          isDraft ? emitUpdate('begin_timestamp', $event) : () => null
        "
        >{{ $t("event_editor.begin_timestamp") }}
        <template
          v-if="v$.modelValue.begin_timestamp.$errors.length > 0"
          v-slot:errors
        >
          <div
            class="input-errors"
            v-for="error of v$.modelValue.begin_timestamp.$errors"
            :key="error.$uid"
          >
            <div class="error-msg">
              {{ $t("validation_errors.event." + error.$uid) }}
            </div>
          </div>
        </template></CalendarInput
      >
      <CalendarInput
        class=""
        :modelValue="modelValue.end_timestamp"
        @update:modelValue="emitUpdate('end_timestamp', $event)"
        >{{ $t("event_editor.end_timestamp") }}
        <template
          v-if="v$.modelValue.end_timestamp.$errors.length > 0"
          v-slot:errors
        >
          <div
            class="input-errors"
            v-for="error of v$.modelValue.end_timestamp.$errors"
            :key="error.$uid"
          >
            <div class="error-msg">
              {{ $t("validation_errors.event." + error.$uid) }}
            </div>
          </div>
        </template></CalendarInput
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
          class="-ml-1.5"
          :modelValue="modelValue.exercises_shown_at_a_time"
          :options="exercisesShownAtOnceOptions"
          @update:modelValue="emitUpdate('exercises_shown_at_a_time', $event)"
        ></RadioGroup>
      </div>
      <Toggle
        :labelOnLeft="true"
        v-show="modelValue.exercises_shown_at_a_time == 1"
        :modelValue="modelValue.allow_going_back"
        @update:modelValue="emitUpdate('allow_going_back', $event)"
        >{{ $t("event_editor.allow_going_back_label") }}</Toggle
      >
    </div>

    <div class="flex flex-col mt-12 space-y-4">
      <h3>{{ $t("event_editor.access_rules") }}</h3>
      <RadioGroup
        class="-ml-1.5"
        :modelValue="modelValue.access_rule"
        :options="accessRulesOptions"
        @update:modelValue="onAccessRuleChange($event)"
      ></RadioGroup>
      <div
        class="
          flex
          md:flex-row
          flex-col
          md:space-y-0
          space-y-2
          md:items-center
          -ml-0.5
        "
      >
        <div class="flex items-center">
          <span class="mr-2 text-xl material-icons text-primary">
            {{
              modelValue.access_rule === EventAccessRule.ALLOW_ACCESS
                ? "public"
                : "lock"
            }}</span
          >
          <p class="text-muted">
            {{
              modelValue.access_rule === EventAccessRule.ALLOW_ACCESS
                ? $t("event_editor.allow_access_description")
                : $t("event_editor.deny_access_description")
            }}
          </p>
        </div>
        <Btn
          @click="showAccessRuleDialog = true"
          :class="[
            modelValue.access_rule === EventAccessRule.DENY_ACCESS
              ? 'visible'
              : 'invisible',
            'md:ml-8',
          ]"
          :variant="'primary'"
          ><span class="mr-2 material-icons"> people </span>
          {{ $t("event_editor.choose_allowed") }}</Btn
        >
        <p
          :class="[
            modelValue.access_rule === EventAccessRule.DENY_ACCESS
              ? 'visible'
              : 'invisible',
            'md:ml-4',
          ]"
        >
          <strong>{{ modelValue.access_rule_exceptions?.length ?? 0 }}</strong>
          {{ $t("event_editor.allowed_students") }}
        </p>
      </div>
    </div>

    <Dialog
      :showDialog="showAccessRuleDialog"
      @yes="showAccessRuleDialog = false"
      :confirmOnly="true"
      :large="true"
    >
      <template v-slot:title>
        {{ $t("event_editor.choose_allowed") }}
      </template>
      <template v-slot:body>
        <div class="flex flex-col mt-3 space-y-2">
          <p>{{ $t("event_editor.manage_allowed_description") }}</p>
          <TagInput
            :modelValue="allowedAccessAsTags"
            :allowAutocomplete="false"
            @addTag="onAddAllowedAccess($event)"
            @removeTag="onRemoveAllowedAccess($event)"
            :placeholder="$t('event_editor.student_email')"
          ></TagInput>
        </div>
        <div class="flex flex-col mt-12 space-y-4">
          <h3 class="text-darkText">
            {{ $t("event_editor.import_from_valutami") }}
          </h3>
          <div
            class="flex flex-col items-start space-y-2  md:space-y-0 md:space-x-2 md:flex-row md:space-x-6"
          >
            <div
              class="mlw-32 mt-1.5 overflow-hidden rounded-sm shadow-elevation"
            >
              <img class="w-32" src="../../../../public/valutami.png" />
            </div>
            <div class="flex flex-col space-y-2">
              <p>
                {{ $t("event_editor.manage_allowed_import_from_valutami_1") }}

                <strong>{{
                  $t("event_editor.manage_allowed_import_from_valutami_2")
                }}</strong
                >.
                {{ $t("event_editor.manage_allowed_import_from_valutami_3") }}
              </p>
              <div>
                <input type="file" @change="onFileInputChange" />
              </div>
            </div>
          </div>
        </div>
      </template>
    </Dialog>

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
import { defineComponent, inject } from "@vue/runtime-core";
import { Event, EventAccessRule, EventState, Tag } from "@/models";
import Toggle from "@/components/ui/Toggle.vue";
//import NumberInput from '@/components/ui/NumberInput.vue'
import { PropType } from "vue";
//import Btn from '@/components/ui/Btn.vue'
import RadioGroup from "@/components/ui/RadioGroup.vue";
import { getTranslatedString as _ } from "@/i18n";
import Dialog from "@/components/ui/Dialog.vue";
import { SelectableOption } from "@/interfaces";
import Btn from "@/components/ui/Btn.vue";
import TagInput from "@/components/ui/TagInput.vue";
import { ChangeEvent } from "ag-grid-community/dist/lib/widgets/agCheckbox";
import { csvToArray, setErrorNotification } from "@/utils";

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
    Btn,
    TagInput,
  },
  props: {
    modelValue: {
      type: Object as PropType<Event>,
      required: true,
    },
  },
  setup() {
    return {
      v$: inject("v$"),
    };
  },
  data() {
    return {
      event: {} as Event,
      saving: false,
      showDialog: false,
      showAccessRuleDialog: false,
      EventAccessRule,
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
    onAccessRuleChange(newVal: EventAccessRule) {
      this.emitUpdate("access_rule", newVal);
      if (newVal === EventAccessRule.ALLOW_ACCESS) {
        this.emitUpdate("access_rule_exceptions", []);
      }
    },
    onAddAllowedAccess(value: string) {
      // TODO investigate
      setTimeout(
        // have to delay in order to prevent issues with tag input component, which uses nextTick
        () =>
          this.emitUpdate("access_rule_exceptions", [
            ...(this.modelValue.access_rule_exceptions ?? []),
            value,
          ]),
        10
      );
    },
    onRemoveAllowedAccess(value: string) {
      this.emitUpdate(
        "access_rule_exceptions",
        this.modelValue.access_rule_exceptions?.filter(
          (e) => e.toLowerCase() !== value.toLowerCase()
        ) ?? []
      );
    },
    async onFileInputChange(event: { target: HTMLInputElement }) {
      console.log("FILES", event.target.files);
      if (event.target.files === null || event.target.files.length === 0) {
        return;
      }
      try {
        const file = event.target.files[0];

        const fileContents = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => {
            resolve(reader.result as string);
          };
          reader.onerror = reject;
          reader.readAsText(file);
        });

        const FIRST_HEADER_NAME = "Matricola";
        const EMAIL_HEADER_NAME = "Email";
        console.log("contents", csvToArray(fileContents, FIRST_HEADER_NAME));

        const csvElements = csvToArray(fileContents, FIRST_HEADER_NAME);

        const validCsvRecords = csvElements.filter((e) => e[EMAIL_HEADER_NAME]);
        if (validCsvRecords.length === 0) {
          throw new Error();
        }
        this.emitUpdate(
          "access_rule_exceptions",
          validCsvRecords.map(
            (e) => e[EMAIL_HEADER_NAME]?.slice(1, -1) ?? "" // remove quotes
          )
        );
        this.$store.commit("shared/showSuccessFeedback");
      } catch (e) {
        setErrorNotification(_("misc.wrong_file_format"), true);
        throw e;
      } finally {
        event.target.value = "";
      }
    },
  },
  computed: {
    isDraft() {
      return this.modelValue.state == EventState.DRAFT;
    },
    allowedAccessAsTags(): Tag[] {
      return (
        this.modelValue.access_rule_exceptions?.map((e) => ({
          id: "",
          name: e,
        })) ?? []
      );
    },
    accessRulesOptions(): SelectableOption[] {
      return [
        {
          value: EventAccessRule.ALLOW_ACCESS,
          content: _("event_editor.allow_everyone_access_label"),
        },
        {
          value: EventAccessRule.DENY_ACCESS,
          content: _("event_editor.deny_access_by_default_label"),
        },
      ];
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
