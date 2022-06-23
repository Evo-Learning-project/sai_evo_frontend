<template>
  <div>
    <DropdownMenu :expanded="expanded" @toggleExpanded="expanded = !expanded">
      <template v-slot:icon>
        <span class="text-lg material-icons-outlined text-lightText"
          >language</span
        >
      </template>
      <div class="-mx-5 -my-3">
        <ul class="">
          <li
            tabindex="0"
            v-wave
            :class="[
              locale === $i18n.locale
                ? 'bg-primary bg-opacity-20 text-primary font-semibold'
                : 'hover:bg-light',
            ]"
            class="flex px-8 py-2 transition-colors cursor-pointer  items-top duration75"
            v-for="locale in $i18n.availableLocales"
            :key="'locale-' + locale"
            @click="onLocaleChange(locale)"
          >
            {{ $t("locales." + locale) }}
          </li>
        </ul>
      </div>
    </DropdownMenu>
  </div>
</template>

<script lang="ts">
const SELECTED_LOCALE_KEY = "locale";
import { defineComponent, PropType } from "@vue/runtime-core";
import Btn from "./Btn.vue";
import DropdownMenu from "./DropdownMenu.vue";
export default defineComponent({
  name: "LocaleSelector",
  props: {},
  created() {
    if (SELECTED_LOCALE_KEY in localStorage) {
      this.$i18n.locale = localStorage.getItem(SELECTED_LOCALE_KEY) as string;
    }
  },
  methods: {
    onLocaleChange(locale: string) {
      this.$i18n.locale = locale;
      localStorage.setItem(SELECTED_LOCALE_KEY, locale);
    },
  },
  computed: {},
  components: { DropdownMenu },
  data() {
    return {
      expanded: false,
    };
  },
});
</script>

<style></style>
