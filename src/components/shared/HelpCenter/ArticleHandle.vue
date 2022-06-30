<template>
  <span
    class="underline cursor-pointer text-primary hover:text-primary-dark"
    @click="onClick"
  >
    <slot></slot>
    <span>{{ text }}</span>
  </span>
</template>

<script lang="ts">
import { getArticles } from "@/helpCenter";
import { getTranslatedString as _ } from "@/i18n";
import { defineComponent, PropType } from "@vue/runtime-core";
import { createNamespacedHelpers } from "vuex";

const { mapMutations } = createNamespacedHelpers("shared");
export default defineComponent({
  name: "ArticleHandle",
  props: {
    text: {
      type: String,
      default: _("misc.find_out_more"),
    },
    articleId: {
      type: String,
      required: true,
      validator(value: string) {
        return getArticles()
          .map((a) => a.id)
          .includes(value);
      },
    },
  },
  methods: {
    ...mapMutations(["setHelpCenterVisibility", "setHelpCenterArticleId"]),
    onClick() {
      this.setHelpCenterVisibility(true);
      this.setHelpCenterArticleId(this.articleId);
    },
  },
  computed: {},
});
</script>

<style></style>
