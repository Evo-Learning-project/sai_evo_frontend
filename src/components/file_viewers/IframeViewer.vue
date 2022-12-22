<template>
	<div
		class="fixed h-screen w-screen top-0 left-0 bg-dark bg-opacity-60"
		style="z-index: 1000"
		@click="$emit('viewerClose')"
	/>
	<!-- control bar -->
	<div
		style="z-index: 1002"
		class="
			flex
			items-center
			bg-dark
			fixed
			top-0
			left-0
			w-full
			h-14
			shadow-elevation
			bg-opacity-90
			px-2
		"
	>
		<div class="mr-auto">
			<Btn class="mr-2" :variant="'icon'" :outline="true" @click="$emit('viewerClose')">
				<span class="material-icons-outlined text-lightText">close</span>
			</Btn>
		</div>
		<div class="text-lightText flex items-center space-x-4">
			<h3 class="">{{ filename }}</h3>
			<p class="text-sm opacity-70" v-if="pageCount !== null">
				{{ pageCount }} {{ pageCount === 1 ? $t("misc.page") : $t("misc.pages") }}
			</p>
		</div>
		<div class="ml-auto">
			<Btn
				class="mr-2"
				:loading="downloading"
				:variant="'icon'"
				:outline="true"
				@click="$emit('download')"
			>
				<span class="material-icons-outlined text-lightText">file_download</span>
			</Btn>
			<Btn class="" :variant="'icon'" :outline="true" @click="onZoom(100)">
				<span class="material-icons-outlined text-lightText">zoom_in</span>
			</Btn>
			<Btn :variant="'icon'" :outline="true" @click="onZoom(-100)">
				<span class="material-icons-outlined text-lightText">zoom_out</span>
			</Btn>
		</div>
	</div>
	<div
		style="z-index: 1001"
		class="
			mt-14
			fixed
			top-1/2
			transform
			-translate-y-1/2 -translate-x-1/2
			left-1/2
			overflow-y-auto
			h-screen
		"
	>
		<div class="relative">
			<transition name="fade">
				<LinearProgress v-if="isLoading || downloading" class="z-50 absolute top-0" />
			</transition>
			<!-- iframe -->

			<!-- slides -->
			<iframe
				src="https://docs.google.com/presentation/d/e/2PACX-1vSI-k_1OuiSoiqYcpnJVQjd6tUgJqsCXMy44elVvQveKqF5Dqitg9NhCLBUgGagkQ/embed?start=false&loop=false&delayms=3000"
				frameborder="0"
				width="1000"
				height="400"
				allowfullscreen="true"
				mozallowfullscreen="true"
				webkitallowfullscreen="true"
			></iframe>

			<!-- yt -->
			<!-- <iframe
				id="ytplayer"
				type="text/html"
				width="640"
				height="360"
				src="https://www.youtube.com/embed/M7lc1UVf-VE?autoplay=1&origin=http://example.com"
				frameborder="0"
			></iframe> -->

			<!-- docs -->
			<!-- <iframe
				frameborder="0"
				width="1000"
				height="800"
				src="https://docs.google.com/document/d/e/2PACX-1vSXWSadQVVggxYswsurURRxa3apIH_gQpaoqZIkmuYVRTAkr8SzmFPby6M_uIcZXN82i6Y6yGmwC37p/pub?embedded=true"
			></iframe> -->
		</div>
	</div>
</template>

<script lang="ts">
import { defineComponent, PropType } from "@vue/runtime-core";
import Btn from "../ui/Btn.vue";
import LinearProgress from "../ui/LinearProgress.vue";
import { fileViewerProps } from "./shared";
import { arraybufferToBase64 } from "@/utils";
import { downloadFileNode } from "@/api";
import { fileViewerMixin } from "@/mixins";
export default defineComponent({
	name: "PdfViewer",
	props: {
		...fileViewerProps,
	},
	components: {
		Btn,
		LinearProgress,
	},
	mixins: [fileViewerMixin],
	mounted() {
		const bodyContainsOverflowHidden =
			document.body.classList.contains("overflow-y-hidden");
		if (!bodyContainsOverflowHidden) {
			document.body.classList.add("overflow-y-hidden");
		}
	},
	beforeUnmount() {
		const bodyContainsOverflowHidden =
			document.body.classList.contains("overflow-y-hidden");
		if (bodyContainsOverflowHidden) {
			document.body.classList.remove("overflow-y-hidden");
		}
	},
	data() {
		return {
			//downloading: true,
			isLoading: true,
			reRendering: false,
			page: null,
			pageCount: null as null | number,
			showAllPages: true,
			width: 800,
			//source: "",
		};
	},
	methods: {},
	computed: {},
});
</script>

<style></style>
