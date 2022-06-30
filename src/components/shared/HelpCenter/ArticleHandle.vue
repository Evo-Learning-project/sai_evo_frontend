<template>
  <span>
    <slot></slot>
    <span>{{ text }}></span>
  </span>
</template>

<script lang="ts">
import { getArticles } from "@/helpCenter";
import { getTranslatedString as _ } from "@/i18n";
import { defineComponent, PropType } from "@vue/runtime-core";
export default defineComponent({
  name: "ArticleHandle",
  props: {
    text: {
      type: String,
      default: _("misc.find_out_more"),
    },
    articleId: {
      type: String,
      validator(value: string) {
        return getArticles()
          .map((a) => a.id)
          .includes(value);
      },
    },
  },
  methods: {},
  computed: {},
});
</script>

<style></style>
