<template>
	<Card :size="'sm'" :hoverable="false">
		<template v-slot:header>
			<div class="relative">
				<div class="absolute top-0 w-full">
					<div class="flex w-full space-x-4">
						<div class="w-11/12 skeleton-unit"></div>
						<div class="w-1/12 rounded-full skeleton-unit"></div>
					</div>
				</div>
				<div class="opacity-0">
					<div class="flex items-center">
						<h5>&nbsp;</h5>
						<div class="flex ml-2 space-x-1"></div>
						<div class="my-auto ml-4 cursor-default chip chip-sm">
							<div class="flex items-center">&nbsp;</div>
						</div>
					</div>
				</div>
			</div>
		</template>

		<template v-slot:body>
			<div class="relative">
				<div class="absolute top-0 w-full">
					<div class="w-full h-4 my-2 skeleton-unit"></div>
					<div class="w-full h-4 skeleton-unit"></div>
				</div>
				<div class="relative h-12 overflow-y-hidden opacity-0">
					<div
						style="display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden"
						class="w-11/12 overflow-x-hidden overflow-ellipsis text-muted"
					>
						&nbsp;
					</div>
				</div>
			</div>
		</template>
	</Card>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import Card from "../Card.vue";

export default defineComponent({
	name: "MinimalExercisePreviewSkeleton",
	components: {
		Card,
	},
});
</script>

<style></style>
