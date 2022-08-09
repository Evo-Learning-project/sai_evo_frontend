<template>
	<div class="flex flex-col items-center w-full mx-auto mt-16">
		<p style="font-size: 10rem" class="material-icons-outlined opacity-10">
			error_outline
		</p>
		<h2 class="opacity-40">{{ $t("errors.404") }}</h2>
		<Btn class="mt-2" @click="$router.go(-1)">{{ $t("errors.back") }}</Btn>
	</div>
</template>

<script lang="ts">
import { defineComponent, PropType } from "@vue/runtime-core";
import Btn from "@/components/ui/Btn.vue";
export default defineComponent({
	name: "PageNotFound",
	props: {},
	methods: {},
	computed: {},
	components: { Btn },
});
</script>

<style></style>
