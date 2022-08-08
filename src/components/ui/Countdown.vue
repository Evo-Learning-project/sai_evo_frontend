<template>
	<div
		class="flex items-center w-max text-muted"
		:class="{
			shake: (littleTimeRemaining && !hasShakenLittleTime) || (lessThanHalfTimeRemaining && !hasShakenHalfTime),
			'opacity-0': !isInitialTimeValid,
		}"
		@animationend="onShakeEnd()"
	>
		<span class="mr-0.5 material-icons-outlined" v-if="!littleTimeRemaining">timer</span>
		<span class="mr-0.5 text-danger-dark -mt-0.5" v-else
			><svg style="width: 24px; height: 24px" viewBox="0 0 24 24">
				<path
					fill="currentColor"
					d="M9 8H11V14H9V8M13 1H7V3H13V1M17.03 7.39C18.26 8.93 19 10.88 19 13C19 17.97 15 22 10 22C5.03 22 1 17.97 1 13S5.03 4 10 4C12.12 4 14.07 4.74 15.62 6L17.04 4.56C17.55 5 18 5.46 18.45 5.97L17.03 7.39M17 13C17 9.13 13.87 6 10 6S3 9.13 3 13 6.13 20 10 20 17 16.87 17 13M21 7V13H23V7H21M21 17H23V15H21V17Z"
				/>
			</svg>
		</span>
		<p class="ml-1" :class="{ 'text-danger-dark': littleTimeRemaining }">
			<span v-if="initialSeconds >= 3600">{{ formattedTime.hours }}:</span>{{ formattedTime.minutes }}:{{
				formattedTime.seconds
			}}
		</p>
	</div>
</template>

<script lang="ts">
import { defineComponent, PropType } from "@vue/runtime-core";
export default defineComponent({
	name: "Countdown",
	props: {
		initialSeconds: {
			type: Number,
			required: true,
		},
		isInitialized: {
			type: Boolean,
			required: true,
		},
	},
	watch: {
		isInitialized(newVal) {
			if (newVal) {
				this.startTimer();
			} else {
				this.stopTimer();
			}
		},
	},
	data() {
		return {
			seconds: 0,
			shake: false,
			handle: null as number | null,
			hasShakenHalfTime: false,
			hasShakenLittleTime: false,
		};
	},
	methods: {
		startTimer() {
			this.seconds = this.initialSeconds;
			if (this.seconds <= 0) {
				this.stopTimer();
				this.$emit("timeUp");
			}

			this.handle = setInterval(() => {
				if (--this.seconds === 0) {
					this.stopTimer();
					this.$emit("timeUp");
				}

				if (this.littleTimeRemaining) {
					this.shake = true;
				}
			}, 1000);
		},
		stopTimer() {
			clearInterval(this.handle as number);
			this.handle = null;
		},
		onShakeEnd() {
			if (!this.hasShakenHalfTime) {
				this.hasShakenHalfTime = true;
			} else if (!this.hasShakenLittleTime) {
				this.hasShakenLittleTime = true;
			}
		},
	},
	computed: {
		formattedTime(): { hours: string; minutes: string; seconds: string } {
			const hours = Math.floor(this.seconds / 3600);
			const minutes = Math.floor((this.seconds - hours * 3600) / 60);
			const seconds = this.seconds - minutes * 60 - hours * 3600;

			return {
				hours: String(hours).padStart(2, "0"),
				minutes: String(minutes).padStart(2, "0"),
				seconds: String(seconds).padStart(2, "0"),
			};
		},
		littleTimeRemaining(): boolean {
			return this.isInitialized && this.seconds < 5 * 60;
		},
		lessThanHalfTimeRemaining(): boolean {
			return this.isInitialized && this.seconds < Math.floor(this.initialSeconds / 2);
		},
		isInitialTimeValid(): boolean {
			return !isNaN(this.initialSeconds);
		},
	},
});
</script>

<style></style>
