<template>
	<Card :hoverable="false" :borderLess="borderLess" :class="[full ? 'h-96' : '']">
		<template v-slot:header>
			<div
				:class="[short ? 'h-3' : 'h-4']"
				class="bg-gray-200 rounded animate-pulse"
			></div>
		</template>
		<template v-slot:body>
			<div :class="{ 'pb-8': !short }">
				<div
					:class="[short ? 'h-3' : 'h-4']"
					class="w-11/12 mb-2 bg-gray-200 rounded animate-pulse"
				></div>
				<div :class="[short ? 'h-3 space-y-2' : 'h-4 space-y-3']" class="animate-pulse">
					<div class="grid grid-cols-3" :class="[short ? 'gap-2' : 'gap-4']">
						<div
							:class="[short ? 'h-3' : 'h-4']"
							class="col-span-2 bg-gray-200 rounded"
						></div>
						<div
							:class="[short ? 'h-3' : 'h-4']"
							class="col-span-1 bg-gray-200 rounded"
						></div>
					</div>

					<div v-if="!short" class="w-11/12 h-4 bg-gray-200 rounded"></div>
				</div>
			</div>

			<div v-if="full" class="mt-12" :class="{ 'pb-8': !short }">
				<div
					:class="[short ? 'h-3' : 'h-4']"
					class="w-11/12 mb-2 bg-gray-200 rounded animate-pulse"
				></div>
				<div :class="[short ? 'h-3 space-y-2' : 'h-4 space-y-3']" class="animate-pulse">
					<div class="grid grid-cols-3" :class="[short ? 'gap-2' : 'gap-4']">
						<div
							:class="[short ? 'h-3' : 'h-4']"
							class="col-span-2 bg-gray-200 rounded"
						></div>
						<div
							:class="[short ? 'h-3' : 'h-4']"
							class="col-span-1 bg-gray-200 rounded"
						></div>
					</div>

					<div v-if="!short" class="w-11/12 h-4 bg-gray-200 rounded"></div>
				</div>
			</div>
			<div
				v-if="full"
				:class="[short ? 'h-3' : 'h-4']"
				class="col-span-2 mt-12 bg-gray-200 rounded"
			></div>
		</template>
	</Card>
</template>

<script lang="ts">
import { defineComponent } from "@vue/runtime-core";
import Card from "./Card.vue";
export default defineComponent({
	name: "SkeletonCard",
	components: {
		Card,
	},
	props: {
		short: {
			type: Boolean,
			default: false,
		},
		borderLess: {
			type: Boolean,
			default: false,
		},
		full: {
			type: Boolean,
			default: false,
		},
	},
});
</script>
