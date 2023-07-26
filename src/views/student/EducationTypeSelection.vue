<template>
	<div
		v-if="step === 0"
		class="flex items-center flex-col align-middle content-center w-full"
	>
		<h1>Sei uno studente universitario o delle superiori?</h1>

		<div class="flex space-x-12 mt-12 mb-12">
			<!-- high school -->
			<!-- <SelectableCard
				:selected="selectedEducationLevel === 'high_school'"
				@itemSelected="onSelectEducationLevel('high_school')"
			>
				<template #image
					><img
						class="mx-auto pointer-events-none select-none w-52"
						src="@/assets/illustrations/high_school.svg"
				/></template>
				<template #title>
					<h2 class="mx-auto select-none mt-10 mb-0">Scuole superiori</h2>
				</template>
			</SelectableCard>

<SelectableCard
				:selected="selectedEducationLevel === 'university'"
				@itemSelected="onSelectEducationLevel('university')"
			>
				<template #image
					><img
						class="mx-auto pointer-events-none select-none w-52"
						src="@/assets/illustrations/university.svg"
				/></template>
				<template #title>
					<h2 class="mx-auto select-none mt-10 mb-0">Università</h2>
				</template>
			</SelectableCard>
			-->
		</div>

		<Btn v-if="selectedEducationLevel" @click="step++">Conferma</Btn>
	</div>
	<div
		v-else-if="step === 1"
		class="flex items-center flex-col align-middle content-center w-full"
	>
		<h1>Quali di queste materie vuoi studiare su Evo?</h1>

		<div class="flex space-x-12 mt-12 mb-12">
			<!-- high school -->
			<SelectableCard
				v-for="subject in availableSubjects"
				:key="subject.name"
				:selected="selectedSubjects.includes(subject.name)"
				@itemSelected="onToggleSubject(subject.name)"
			>
				<template #image
					><img
						class="mx-auto pointer-events-none select-none w-48"
						:src="getImageUrl(subject.image)"
				/></template>
				<template #title>
					<h2 class="mx-auto select-none mt-10 mb-0">{{ subject.name }}</h2>
				</template>
			</SelectableCard>
		</div>

		<Btn v-if="selectedEducationLevel" @click="step++">Conferma</Btn>
	</div>
</template>

<script lang="ts">
import { defineComponent, PropType } from "@vue/runtime-core";
import Btn from "../../components/ui/Btn.vue";
import SelectableCard from "../../components/ui/SelectableCard.vue";

export default defineComponent({
	name: "EducationLevelSelection",
	props: {},
	methods: {
		onSelectEducationLevel(type: "university" | "high_school") {
			this.selectedEducationLevel = type;
		},
		onToggleSubject(subject) {
			if (this.selectedSubjects.includes(subject)) {
				this.selectedSubjects = this.selectedSubjects.filter(s => s !== subject);
			} else {
				this.selectedSubjects.push(subject);
			}
		},
		getImageUrl(imageName: string) {
			// eslint-disable-next-line no-undef
			return require("@/assets/illustrations/" + imageName);
		},
	},
	data() {
		return {
			step: 0 as 0 | 1,
			selectedEducationLevel: null as null | "university" | "high_school",
			selectedSubjects: [] as string[],
			availableSubjects: [
				{
					name: "Matematica",
					image: "math.svg",
				},
				{
					name: "Informatica",
					image: "coding.svg",
				},
				{
					name: "Inglese",
					image: "languages.svg",
				},
			],
		};
	},
	computed: {},
	components: { Btn, SelectableCard },
});
</script>

<style></style>
