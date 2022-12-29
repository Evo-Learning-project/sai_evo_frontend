<template>
	<div class="flex items-center max-w-xs overflow-x-auto text-xs md:max-w-max text-muted">
		<!-- <span class="text-base material-icons-outlined"> home </span> -->
		<!-- <span class="text-base material-icons-outlined opacity-60">navigate_next</span> -->
		<div
			v-for="(breadcrumb, index) in breadcrumbs"
			:key="'breadcrumb-' + index"
			class="flex items-center bg-black bg-opacity-0"
		>
			<span
				class="font-semibold opacity-80 breadcrumb-item"
				v-if="breadcrumb.routeName === $route.name"
				>{{ breadcrumb.title }}</span
			>
			<router-link
				v-else
				:to="{
					name: breadcrumb.routeName,
					params: breadcrumb.routeParams ?? {},
				}"
				class="link breadcrumb-item"
			>
				<span class="">{{ breadcrumb.title }} </span>
			</router-link>
			<!-- <span
				v-if="index !== breadcrumbs.length - 1"
				class="text-base material-icons-outlined opacity-60"
				>navigate_next</span
			> -->
			<span v-if="index !== breadcrumbs.length - 1" class="mx-2 opacity-60">/</span>
		</div>
	</div>
</template>

<script lang="ts">
import { courseIdMixin, eventIdMixin, nodeIdMixin } from "@/mixins";
import { BreadCrumb } from "@/navigation/breadcrumbs";
import {
	ROUTE_TITLE_COURSE_NAME_TOKEN,
	ROUTE_TITLE_EVENT_NAME_TOKEN,
	ROUTE_TITLE_NODE_NAME_TOKEN,
} from "@/navigation/const";
import { useMainStore } from "@/stores/mainStore";
import { defineComponent, PropType } from "@vue/runtime-core";
import { mapStores } from "pinia";
import { RouteLocationNormalizedLoaded } from "vue-router";
import { getCourseTreeNodeTitle } from "@/models";

export default defineComponent({
	name: "BreadCrumbs",
	mixins: [courseIdMixin, eventIdMixin, nodeIdMixin],
	props: {
		route: {
			type: Object as PropType<RouteLocationNormalizedLoaded>,
			required: true,
		},
	},
	methods: {
		replaceTitleTokens(str: string) {
			const currentNode = this.mainStore.getCourseTreeNodeById(this.nodeId);
			return str
				?.replace(ROUTE_TITLE_COURSE_NAME_TOKEN, this.currentCourse.name)
				?.replace(ROUTE_TITLE_EVENT_NAME_TOKEN, this.currentEvent || this.previewingEvent)
				?.replace(
					ROUTE_TITLE_NODE_NAME_TOKEN,
					currentNode ? getCourseTreeNodeTitle(currentNode) : "",
				);
		},
	},
	computed: {
		...mapStores(useMainStore),
		breadcrumbs(): BreadCrumb[] {
			return ((this.route.meta.breadcrumbs as BreadCrumb[]) ?? []).map(b => ({
				...b,
				title: this.replaceTitleTokens(b.title),
			}));
		},
	},
});
</script>

<style>
.breadcrumb-item {
	max-width: 10rem;
	overflow: hidden;
	white-space: nowrap;
	text-overflow: ellipsis;
}
@media (min-width: 1024px) {
	.breadcrumb-item {
		max-width: max-content;
	}
}
</style>
