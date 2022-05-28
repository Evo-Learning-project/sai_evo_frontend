<template>
  <DraggablePopup
    :whiteBg="true"
    :dragOnTitleOnly="true"
    :initialTop="60"
    :initialLeft="56.5"
    @close="$emit('close')"
    :title="$t('help.help_center_title')"
  >
    <div class="mt-3">
      <div v-if="selectedArticleId === null">
        <h4 class="mb-4">
          <span class="mr-1 material-icons-outlined inline-icon text-primary">
            auto_awesome
          </span>
          {{ $t("help.based_on_your_activity") }}
        </h4>
        <div
          v-wave
          @click="selectedArticleId = article.id"
          class="flex items-center px-2 py-2 ml-1 transition-colors cursor-pointer  duration75 hover:bg-light"
          v-for="article in relevantArticles"
          :key="'art-' + article.id + '-relevant'"
        >
          <div
            class="
              w-8
              h-8
              pt-0.5
              pl-1.5
              mr-2
              rounded-full
              bg-primary bg-opacity-20
            "
          >
            <span
              class="text-xl text-primary material-icons-outlined icon-light"
            >
              article
            </span>
          </div>
          <p>{{ article.title }}</p>
        </div>
      </div>

      <HelpCenterArticleFull
        v-else
        :article="selectedArticle"
        @back="selectedArticleId = null"
      ></HelpCenterArticleFull>
    </div>
  </DraggablePopup>
</template>

<script lang="ts">
import { defineComponent, PropType } from "@vue/runtime-core";
import DraggablePopup from "@/components/ui/DraggablePopup.vue";
import { getArticle, getArticles, HelpCenterArticle } from "@/helpCenter";
import HelpCenterArticleFull from "./HelpCenterArticleFull.vue";
export default defineComponent({
  name: "HelpCenter",
  components: { DraggablePopup, HelpCenterArticleFull },

  props: {},
  methods: {},
  data() {
    return {
      selectedArticleId: null as string | null,
    };
  },
  computed: {
    relevantArticles(): HelpCenterArticle[] {
      return getArticles();
    },
    selectedArticle(): HelpCenterArticle | undefined {
      if (this.selectedArticleId === null) {
        return undefined;
      }
      return getArticle(this.selectedArticleId);
    },
  },
});
</script>

<style></style>
