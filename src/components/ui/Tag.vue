<template>
	<div class="ti-tag" :class="{ 'ti-tag-sm': small }">{{ tag.name }}</div>
</template>

<script>
export default {
	name: "Tag",
	props: {
		tag: {
			type: Object,
		},
		small: {
			type: Boolean,
			default: false,
		},
	},
};
</script>

<style></style>
