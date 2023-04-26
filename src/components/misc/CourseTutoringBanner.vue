<template>
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

			<div class="flex items-center" v-if="!confirmed">
				<h4 class="mr-6">Cerchi ripetizioni per {{ course.name }}?</h4>
				<Btn :loading="requesting" :disabled="offering" :size="'sm'" @click="onConfirm"
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
					:class="{ 'pointer-events-none cursor-not-allowed': offering || requesting }"
				>
					Voglio offrire ripetizioni
				</p>
			</div>
			<h4 v-else>Grazie per aver mostrato interesse! Ti contatteremo al più presto.</h4>

			<Btn :variant="'icon'" :outline="true" class="ml-auto" @click="onClose">
				<span class="material-icons">close</span>
			</Btn>
		</div>
	</Transition>
</template>

<script lang="ts">
import axios, { AxiosRequestConfig } from "axios";

import { defineComponent, PropType } from "@vue/runtime-core";
import { Course } from "@/models";
import Btn from "@/components/ui/Btn.vue";
export default defineComponent({
	name: "CourseTutoringBanner",
	props: {
		course: {
			type: Object as PropType<Course>,
			required: true,
		},
	},
	// show banner after a short delay
	async created() {
		this.show = await this.shouldDisplayBanner();
	},
	watch: {
		confirmed(newVal) {
			if (newVal) {
				setTimeout(() => (this.show = false), 2000);
			}
		},
	},
	data() {
		return {
			show: false,
			requesting: false,
			offering: false,
			confirmed: false,
		};
	},
	methods: {
		async onOffer() {
			try {
				this.offering = true;
				await this.makeRequest({
					type: "offered_tutor",
					course: this.course.id,
				});
				this.confirmed = true;
				const confirmedCourses = this.getConfirmedCourses();
				confirmedCourses.push(String(this.course.id));
				console.log(this.course, this.course.id);
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
				await this.makeRequest({
					type: "requested_tutor",
					course: this.course.id,
				});
				this.confirmed = true;
				const confirmedCourses = this.getConfirmedCourses();
				confirmedCourses.push(String(this.course.id));
				console.log(this.course, this.course.id);
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
		async getEnabledCourses() {
			return ["7", "2", "8", "15", "30", "27", "18", "25"];
		},
	},
	computed: {},
	components: { Btn },
});
</script>

<style></style>
