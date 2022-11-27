<template>
	<div
		class="fixed h-screen w-screen top-0 left-0 bg-dark bg-opacity-60"
		style="z-index: 1000"
		@click="$emit('viewerClose')"
	/>
	<!-- <div
		class="fixed flex top-0 left-0 w-screen h-screen bg-transparent"
		style="z-index: 1000"
	> -->
	<div
		style="z-index: 1000"
		class="
			fixed
			top-1/2
			left-1/2
			transform
			-translate-x-1/2 -translate-y-1/2
			shadow-all-around
		"
	>
		<VideoPlayer
			v-if="show"
			width="1200"
			controls
			:loop="true"
			:volume="0.6"
			:src="{
				src: url,
				type: 'video/mp4',
			}"
			@mounted="onPlayerMounted($event)"
		/>
	</div>

	<!-- 			src="http://img-ys011.didistatic.com/static/didiglobal/do1_pcUZZjSG7vFlMbdr8fA6#.mp4"
 -->
	<!-- </div> -->

	<!-- 		
        		poster="/your-path/poster.jpg"
...
		@mounted="..."
		@ready="..."
		@play="..."
		@pause="..."
		@ended="..."
		@seeking="..."
		...-->
</template>

<script>
import { VideoPlayer } from "@videojs-player/vue";
import "video.js/dist/video-js.css";
import { fileViewerProps } from "./shared";

import { defineComponent, PropType } from "@vue/runtime-core";
export default defineComponent({
	name: "VideoViewer",
	props: {
		...fileViewerProps,
	},
	mounted() {
		setTimeout(() => (this.show = true), 50);

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
			show: false,
		};
	},
	methods: {
		onPlayerMounted(evt) {
			console.log("player mounted, ", evt);
			const playerInstance = evt.player;
			// playerInstance.Hls.xhr.beforeRequest = options => {
			// 	options.headers = options.headers || {};
			// 	options.headers.Authorization =
			// 		"Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJURUxAMTIzNDUiLCJuYmYiOjE2MjMzMjY5MjMsImlzcyI6Ik5DUEFfQ0xJRU5UIiwiZXhwIjoxNjIzMzI3NTIzfQ.eH271E8JUgGvP85Se77OiPNFQvTuTUpa1SGuzBYq8UY";
			// 	console.log("options", options);
			// 	return options;
			// };
		},
	},
	components: {
		VideoPlayer,
	},
});
</script>
