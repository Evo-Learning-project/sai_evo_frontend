<template>
	<div :id="elementId">
		<!-- in-view version -->
		<div class="h-8">
			<div v-if="saving" class="flex items-center ml-auto space-x-1.5 text-muted">
				<span class="text-xl opacity-80 material-icons-outlined animate-spin">
					sync
				</span>
				<p class="hidden md:block text-base">{{ $t("cloud.saving") }}</p>
			</div>
			<div v-else-if="!hadError" class="flex items-center ml-auto space-x-1.5 text-muted">
				<Tooltip :placement="'left'" :text-value="$t('cloud.changes_saved_to_server')">
					<span
						:class="{
							'tooltip-handle hover:bg-light hover:bg-opacity-100 rounded px-1.5  transition-colors duration-100':
								!showSaved,
						}"
						class="
							text-xl
							cursor-default
							select-none
							opacity-80
							material-icons-outlined
							hover:text-primary
						"
					>
						cloud_done
					</span>
				</Tooltip>

				<p v-if="showSaved" class="mb-0.5 text-base">
					{{ $t("cloud.saved") }}
				</p>
			</div>
			<div v-else>
				<div class="flex items-center space-x-1 text-sm text-muted text-danger-dark">
					<span class="text-sm material-icons-outlined">error_outline</span>
					<span class="">{{ $t("cloud.error") }}</span>
				</div>
			</div>
		</div>

		<!-- end in view version -->

		<!-- out of view version -->
		<transition name="fade-autosave">
			<div
				v-if="showOutOfViewFeedback"
				class="fixed rounded-full bg-opacity-90 top-18 right-8 z-999 bg-gray-50"
			>
				<div class="opacity-70 shadow-all-around px-3 pt-1.5 pb-1 pr-3 rounded-full">
					<div v-if="saving" class="flex items-center ml-auto space-x-1.5 text-muted">
						<span class="text-xl opacity-80 material-icons-outlined animate-spin">
							sync
						</span>
						<p class="text-base">{{ $t("cloud.saving") }}</p>
					</div>
					<div
						v-else-if="!hadError"
						class="flex items-center ml-auto space-x-1.5 text-muted"
					>
						<Tooltip
							:placement="'left'"
							:text-value="$t('cloud.changes_saved_to_server')"
						>
							<span
								:class="{
									'tooltip-handle hover:bg-light hover:bg-opacity-100 rounded px-1.5  transition-colors duration-100':
										!showSaved,
								}"
								class="
									text-xl
									cursor-default
									select-none
									opacity-80
									material-icons-outlined
									hover:text-primary
								"
							>
								cloud_done
							</span>
						</Tooltip>

						<p v-if="showSaved" class="mb-0.5 text-base">
							{{ $t("cloud.saved") }}
						</p>
					</div>
					<div v-else>
						<div class="flex items-center space-x-1 text-sm text-muted text-danger-dark">
							<span class="text-sm material-icons-outlined">error_outline</span>
							<span class="">{{ $t("cloud.error") }}</span>
						</div>
					</div>
				</div>
			</div></transition
		>
	</div>
</template>

<script lang="ts">
import { defineComponent } from "@vue/runtime-core";
import Tooltip from "./Tooltip.vue";
import { v4 as uuid4 } from "uuid";
export default defineComponent({
	components: {
		Tooltip,
	},
	name: "CloudSaveStatus",
	props: {
		saving: {
			type: Boolean,
			required: true,
		},
		hadError: {
			type: Boolean,
			default: false,
		},
	},
	watch: {
		saving(newVal: boolean, oldVal: boolean) {
			if (!newVal && oldVal) {
				if (this.showSavedHandle !== null) {
					clearInterval(this.showSavedHandle);
				}
				if (this.showOutOfViewFeedbackHandle !== null) {
					clearInterval(this.showOutOfViewFeedbackHandle);
				}
				// done saving
				this.showSaved = true;
				if (!this.isElementInViewPort()) {
					this.showOutOfViewFeedback = true;
				}
				this.showSavedHandle = setTimeout(() => (this.showSaved = false), 5000);
				this.showOutOfViewFeedbackHandle = setTimeout(
					() => (this.showOutOfViewFeedback = false),
					1000,
				);
			}
			if (newVal && !this.isElementInViewPort()) {
				setTimeout(() => {
					if (this.saving) {
						this.showOutOfViewFeedback = true;
					}
				}, 1000);
			}
		},
	},
	data() {
		return {
			showSaved: false,
			showSavedHandle: null as null | number,
			showOutOfViewFeedback: false,
			showOutOfViewFeedbackHandle: null as null | number,
			elementId: uuid4(),
		};
	},
	methods: {
		isElementInViewPort() {
			const element = document.getElementById(this.elementId) as HTMLElement;
			const rect = element.getBoundingClientRect();

			return (
				rect.top >= 0 &&
				rect.left >= 0 &&
				rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
				rect.right <= (window.innerWidth || document.documentElement.clientWidth)
			);
		},
	},
});
</script>
<style scoped></style>
