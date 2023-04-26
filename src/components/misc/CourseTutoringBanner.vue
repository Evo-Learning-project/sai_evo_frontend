<template>
	<div>
		<Transition name="bounce">
			<div
				v-if="show"
				class="flex items-center py-4 px-4 rounded banner-light shadow-elevation-2 w-full"
			>
				<!-- <img style="width: 50px" src="@/assets/tutor.png" /> -->
				<div class="flex bg-primary bg-opacity-15 p-2 rounded-full mr-3">
					<span
						v-if="!confirmed"
						class="m-auto material-icons text-primary"
						style="font-size: 40px !important"
					>
						supervisor_account
					</span>
					<span
						v-else
						class="m-auto material-icons text-primary"
						style="font-size: 40px !important"
					>
						done
					</span>
				</div>

				<div
					class="flex items-center md:space-y-0 space-y-2 flex-col md:flex-row"
					v-if="!confirmed"
				>
					<h4 class="mr-6">Cerchi ripetizioni per {{ course.name }}?</h4>
					<div class="flex items-center md:space-y-0 space-y-2 flex-col md:flex-row">
						<Btn
							:loading="requesting"
							:disabled="offering"
							:size="'sm'"
							@click="onConfirm"
							>Trova i migliori tutor</Btn
						>
						<p
							@click="onOffer"
							class="
								text-base
								hover:text-primary hover:underline
								ml-4
								cursor-pointer
								text-gray-500
								select-none
							"
							:class="{
								'pointer-events-none cursor-not-allowed': offering || requesting,
							}"
						>
							Voglio offrire ripetizioni
						</p>
					</div>
				</div>
				<h4 v-else>Grazie per aver mostrato interesse! Ti contatteremo al più presto.</h4>

				<Btn :variant="'icon'" :outline="true" class="ml-auto" @click="onClose">
					<span class="material-icons">close</span>
				</Btn>
			</div>
		</Transition>
		<Dialog
			@yes="resolveBlockingDialog(true)"
			@no="resolveBlockingDialog(false)"
			:showDialog="showBlockingDialog"
			:yesText="offering ? 'Offri ripetizioni' : 'Cerca tutor'"
			:noText="'Annulla'"
		>
			<template v-slot:title>
				<span v-if="offering">Offri ripetizioni</span>
				<span v-else>Cerca tutor</span>
			</template>
			<template v-slot:body>
				<div v-if="offering" class="flex flex-col space-y-4 text-lg">
					<div class="flex items-center w-full">
						<p class="mr-4">Qual è la tua tariffa oraria?</p>
						<NumberInput v-model="hourlyRate" class="w-20 ml-auto mr-1"></NumberInput>
						<p class="text-lg w-12">&euro;</p>
					</div>
					<div class="flex items-center">
						<p class="mr-4">Quante sessioni a settimana vorresti offrire?</p>
						<NumberInput
							v-model="sessionsPerWeek"
							class="w-20 ml-auto mr-1"
						></NumberInput>
						<p class="w-12">sessioni</p>
					</div>
					<div class="flex flex-col">
						<p class="mb-1">Per quali corsi vuoi offrire ripetizioni?</p>
						<Chipset
							class="-ml-1"
							v-model="selectedCourses"
							:options="coursesAsOptions"
						></Chipset>
					</div>
					<div class="flex flex-col">
						<p class="mb-1">Commenti (opzionale)</p>
						<TextEditor
							v-model="comment"
							:baseEditorRows="2"
							:forceBaseEditor="true"
						></TextEditor>
					</div>
				</div>
				<div class="flex flex-col space-y-4 text-lg" v-else>
					<div class="flex items-center">
						<p class="mr-4">Quante sessioni a settimana vorresti fare?</p>
						<NumberInput v-model="sessionsPerWeek" class="w-20 ml-4 mr-1"></NumberInput>
						<p class="">sessioni</p>
					</div>
					<div class="flex flex-col">
						<p class="mb-1">Per quali corsi vorresti prendere ripetizioni?</p>
						<Chipset
							class="-ml-1"
							v-model="selectedCourses"
							:options="coursesAsOptions"
						></Chipset>
					</div>
					<div class="flex flex-col">
						<p class="mb-1">Commenti (opzionale)</p>
						<TextEditor
							v-model="comment"
							:baseEditorRows="2"
							:forceBaseEditor="true"
						></TextEditor>
					</div>
				</div>
			</template>
		</Dialog>
	</div>
</template>

<script lang="ts">
import axios, { AxiosRequestConfig } from "axios";

import { defineComponent, PropType } from "@vue/runtime-core";
import { Course } from "@/models";
import Btn from "@/components/ui/Btn.vue";
import { blockingDialogMixin } from "../../mixins";
import Dialog from "../ui/Dialog.vue";
import NumberInput from "../ui/NumberInput.vue";
import TextEditor from "../ui/TextEditor.vue";
import Chipset from "../ui/Chipset.vue";
import { SelectableOption } from "../../interfaces";
import { mapStores } from "pinia";
import { useMainStore } from "../../stores/mainStore";
export default defineComponent({
	name: "CourseTutoringBanner",
	props: {
		course: {
			type: Object as PropType<Course>,
			required: true,
		},
	},
	mixins: [blockingDialogMixin],
	// show banner after a short delay
	async created() {
		this.show = await this.shouldDisplayBanner();
		this.selectedCourses = [String(this.course.id)];
	},
	watch: {
		confirmed(newVal) {
			if (newVal) {
				setTimeout(() => (this.show = false), 3000);
			}
		},
	},
	data() {
		return {
			show: false,
			requesting: false,
			offering: false,
			confirmed: false,
			selectedCourses: [] as string[],
			hourlyRate: null,
			sessionsPerWeek: null,
			comment: "",
		};
	},
	methods: {
		async onOffer() {
			try {
				this.offering = true;

				const confirmed = await this.getBlockingBinaryDialogChoice();

				const type = confirmed ? "offered_tutor" : "offered_tutor_canceled";

				await this.makeRequest({
					type,
					course: this.course.id,
					houry_rate: this.hourlyRate,
					sessions_per_week: this.sessionsPerWeek,
					selected_courses: this.selectedCourses,
					comment: this.comment,
				});

				this.showBlockingDialog = false;
				if (!confirmed) {
					return;
				}

				this.confirmed = true;

				const confirmedCourses = [
					...this.getConfirmedCourses(),
					String(this.course.id),
					...this.selectedCourses,
				];

				localStorage.setItem(
					"tutoringConfirmedCourses",
					JSON.stringify(confirmedCourses),
				);
			} finally {
				this.offering = false;
			}
		},
		async onConfirm() {
			try {
				this.requesting = true;

				const confirmed = await this.getBlockingBinaryDialogChoice();

				const type = confirmed ? "requested_tutor" : "requested_tutor_canceled";

				await this.makeRequest({
					type,
					course: this.course.id,
					houry_rate: this.hourlyRate,
					sessions_per_week: this.sessionsPerWeek,
					selected_courses: this.selectedCourses,
					comment: this.comment,
				});

				this.showBlockingDialog = false;
				if (!confirmed) {
					return;
				}

				this.confirmed = true;

				const confirmedCourses = [
					...this.getConfirmedCourses(),
					String(this.course.id),
					...this.selectedCourses,
				];

				localStorage.setItem(
					"tutoringConfirmedCourses",
					JSON.stringify(confirmedCourses),
				);
			} finally {
				this.requesting = false;
			}
		},
		async onClose() {
			this.show = false;
			const dismissedCourses = this.getDismissedCourses();
			dismissedCourses.push(String(this.course.id));
			localStorage.setItem("tutoringDismissedCourses", JSON.stringify(dismissedCourses));
		},
		makeRequest(payload) {
			return axios.post("/features/", { feature_id: "tutoring", data: payload });
		},
		getDismissedCourses() {
			try {
				return JSON.parse(localStorage.getItem("tutoringDismissedCourses") || "[]").map(
					i => String(i),
				);
			} catch {
				return [];
			}
		},
		getConfirmedCourses() {
			try {
				return JSON.parse(localStorage.getItem("tutoringConfirmedCourses") || "[]").map(
					i => String(i),
				);
			} catch {
				return [];
			}
		},
		async shouldDisplayBanner() {
			const dismissedCourses = this.getDismissedCourses();
			const confirmedCourses = this.getConfirmedCourses();
			const enabledCourses = await this.getEnabledCourses();
			return (
				!dismissedCourses.includes(String(this.course.id)) &&
				!confirmedCourses.includes(String(this.course.id)) &&
				enabledCourses.includes(String(this.course.id))
			);
		},
		getEnabledCourses() {
			return ["7", "2", "8", "15", "30", "27", "18", "25"];
		},
	},
	computed: {
		...mapStores(useMainStore),
		coursesAsOptions(): SelectableOption[] {
			return [
				...this.mainStore.courses
					.filter(c => this.getEnabledCourses().includes(String(c.id)))
					.map(c => ({
						label: c.name,
						content: c.name,
						value: String(c.id),
					})),
				{
					label: "Altri",
					content: "Altri (specifica nei commenti)",
					value: "other",
				},
			];
		},
	},
	components: { Btn, Dialog, NumberInput, TextEditor, Chipset },
});
</script>

<style></style>
