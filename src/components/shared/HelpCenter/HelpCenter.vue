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
        <div
          v-if="courseId"
          class="flex items-center px-6 py-4 mb-2 -mx-6  bg-light place-content-evenly"
        >
          <p>{{ $t("help.take_the_tour") }}</p>
          <Btn @click="$emit('startTour')">{{ $t("help.start_tour") }}</Btn>
        </div>

        <!-- relevant articles -->
        <div
          v-if="relevantArticles.length > 0"
          class="flex items-center mb-4 space-x-1.5"
        >
          <span class="material-icons inline-icon text-primary">
            auto_awesome
          </span>
          <h4>{{ $t("help.based_on_your_activity") }}</h4>
        </div>
        <div
          v-wave
          @click="selectedArticleId = article.id"
          class="
            flex
            px-2
            py-2
            ml-1.5
            transition-colors
            cursor-pointer
            items-top
            duration75
            hover:bg-light
          "
          v-for="article in relevantArticles"
          :key="'art-' + article.id + '-relevant'"
        >
          <div
            class="
              w-8
              h-8
              pt-0.5
              pl-1.5
              mr-3
              -mt-0.5
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

        <!-- other articles-->
        <div
          v-if="irrelevantArticles.length > 0"
          class="flex items-center my-4 space-x-1.5"
        >
          <span class="material-icons inline-icon text-primary"> article </span>
          <h4>{{ $t("help.articles") }}</h4>
        </div>
        <div
          v-wave
          @click="selectedArticleId = article.id"
          class="
            flex
            px-2
            py-2
            ml-1.5
            transition-colors
            cursor-pointer
            items-top
            duration75
            hover:bg-light
          "
          v-for="article in irrelevantArticles"
          :key="'art-' + article.id + '-relevant'"
        >
          <div
            class="
              w-8
              h-8
              pt-0.5
              pl-1.5
              mr-3
              -mt-0.5
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
import Btn from "@/components/ui/Btn.vue";
import { courseIdMixin } from "@/mixins";
export default defineComponent({
  name: "HelpCenter",
  components: { DraggablePopup, HelpCenterArticleFull, Btn },
  mixins: [courseIdMixin],
  props: {},
  methods: {
    getArticleRelevance(article: HelpCenterArticle): number {
      const routeTags: string[] = this.$route.meta.tags as string[];
      return article.tags.filter((t) => routeTags.includes(t)).length;
    },
  },
  data() {
    return {
      selectedArticleId: null as string | null,
    };
  },
  computed: {
    relevantArticles(): HelpCenterArticle[] {
      return [...getArticles()]
        .sort(
          (a, b) => this.getArticleRelevance(b) - this.getArticleRelevance(a)
        )
        .filter((a) => this.getArticleRelevance(a) > 0)
        .slice(0, 3);
    },
    irrelevantArticles(): HelpCenterArticle[] {
      return getArticles().filter(
        (a) => !this.relevantArticles.map((r) => r.id).includes(a.id)
      );
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