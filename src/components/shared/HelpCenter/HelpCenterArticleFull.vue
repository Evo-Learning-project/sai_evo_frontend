<template>
	<div>
		<div class="flex items-center space-x-2">
			<Btn
				v-if="allowGoBack"
				@click="$emit('back')"
				:outline="true"
				:variant="'icon'"
				:tooltip="$t('misc.back')"
				><span class="material-icons-outlined"> arrow_back </span></Btn
			>
			<h3 :class="{ 'ml-3': !allowGoBack }" class="mb-0">{{ article.title }}</h3>
		</div>
		<div class="mx-4 mt-2">
			<div v-html="article.content"></div>
		</div>
	</div>
</template>

<script lang="ts">
import { HelpCenterArticle } from "@/helpCenter";
import { defineComponent, PropType } from "@vue/runtime-core";
import Btn from "@/components/ui/Btn.vue";
import { logAnalyticsEvent } from "@/utils";
export default defineComponent({
	name: "HelpCenterArticleFull",
	props: {
		article: {
			type: Object as PropType<HelpCenterArticle>,
			required: true,
		},
		allowGoBack: {
			type: Boolean,
			default: true,
		},
	},
	created() {
		logAnalyticsEvent("openedHelpCenterArticle", { articleId: this.article.id });
	},
	methods: {},
	computed: {},
	components: { Btn },
});
</script>

<style></style>
