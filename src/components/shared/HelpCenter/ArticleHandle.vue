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
import { useMetaStore } from "@/stores/metaStore";
import { defineComponent } from "@vue/runtime-core";
import { mapStores } from "pinia";

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
					.map(a => a.id)
					.includes(value);
			},
		},
	},
	methods: {
		onClick() {
			this.metaStore.setHelpCenterVisibility(true);
			this.metaStore.setHelpCenterArticleId(this.articleId);
		},
	},
	computed: {
		...mapStores(useMetaStore),
	},
});
</script>

<style></style>
