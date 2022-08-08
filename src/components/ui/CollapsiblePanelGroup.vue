<template>
	<div>
		<vue-collapsible-panel-group>
			<vue-collapsible-panel>
				<template #title> Panel A Title </template>
				<template #content> Panel A Content </template>
			</vue-collapsible-panel>
			<vue-collapsible-panel>
				<template #title> Panel B Title </template>
				<template #content> Panel B Content </template>
			</vue-collapsible-panel>
		</vue-collapsible-panel-group>
	</div>
</template>

<script>
import { VueCollapsiblePanelGroup, VueCollapsiblePanel } from "@dafcoe/vue-collapsible-panel";
import "@dafcoe/vue-collapsible-panel/dist/vue-collapsible-panel.css";

export default {
	name: "CollapsiblePanelGroup",
	components: {
		VueCollapsiblePanelGroup,
		VueCollapsiblePanel,
	},
};
</script>

<style></style>
