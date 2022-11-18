<template>
	<div>
		<Dialog
			:footerBorder="true"
			:fullHeight="true"
			:large="true"
			:noPadding="true"
			@yes="$emit('hide')"
			:confirmOnly="true"
			:showDialog="show"
		>
			<template v-slot:body>
				<div class="relative">
					<div class="sticky top-0 z-50 px-2 pt-4 pb-4 bg-white shadow-sm md:px-8">
						<SegmentedControls
							:options="instancesAsSelectableOptions"
							v-model="currentInstance"
						>
						</SegmentedControls>
					</div>
					<div>
						<div class="flex items-center w-full">
							<Btn
								:tooltip="$t('misc.download')"
								:variant="'icon'"
								:outline="true"
								@click="onPrint()"
								class="ml-auto mr-5 -mb-20"
								:loading="saving"
								><span class="material-icons">save_alt</span></Btn
							>
						</div>

						<div
							class="px-8"
							v-show="instanceIndex === currentInstance"
							v-for="(_, instanceIndex) in instances"
							:key="'instance-' + instanceIndex"
							:id="'printable-preview-' + instanceIndex"
						>
							<div
								class="my-12"
								style="break-inside: avoid-page"
								v-for="(__, slotIndex) in instances[instanceIndex]"
								:key="'instance-' + instanceIndex + '-slot-' + slotIndex"
							>
								<h4 class="mb-1">
									{{ $t("event_participation_page.exercise") }}
									{{ slotIndex + 1 }}
								</h4>
								<AbstractEventParticipationSlot
									:allow-edit-assessment="false"
									:allow-edit-submission="false"
									:modelValue="instancesAsSlotArrays[instanceIndex][slotIndex]"
								></AbstractEventParticipationSlot>
							</div>
						</div>
					</div>
				</div>
			</template>
		</Dialog>
	</div>
</template>

<script lang="ts">
import { defineComponent, PropType } from "@vue/runtime-core";
import Dialog from "@/components/ui/Dialog.vue";
import {
	EventParticipationSlot,
	Exercise,
	getFakeEventParticipationSlot,
} from "@/models";
import { SelectableOption } from "@/interfaces";
import SegmentedControls from "@/components/ui/SegmentedControls.vue";
import AbstractEventParticipationSlot from "@/components/shared/AbstractEventParticipationSlot.vue";
import { getTranslatedString as _ } from "@/i18n";
import html2pdf from "html2pdf.js";
import Btn from "@/components/ui/Btn.vue";
import { setErrorNotification } from "@/utils";
import { eventIdMixin } from "@/mixins";
import { mapStores } from "pinia";
import { useMainStore } from "@/stores/mainStore";

export default defineComponent({
	name: "EventInstancesPreview",
	mixins: [eventIdMixin],
	components: {
		Dialog,
		SegmentedControls,
		AbstractEventParticipationSlot,
		Btn,
	},
	props: {
		show: {
			type: Boolean,
			required: true,
		},
		instances: {
			type: Array as PropType<Exercise[][]>,
			required: true,
		},
	},
	data() {
		return {
			currentInstance: 0 as number,
			saving: false,
		};
	},
	methods: {
		async onPrint() {
			const element = document.getElementById(
				"printable-preview-" + this.currentInstance,
			);
			const worker = html2pdf();
			this.saving = true;
			setTimeout(async () => {
				try {
					await worker
						.set({
							filename: this.eventName + "_" + this.currentInstance + ".pdf",
							html2canvas: {},
							jsPDF: {
								orientation: "p",
								unit: "mm",
								format: "a3",
								putOnlyUsedFonts: true,
								floatPrecision: 16, // or "smart", default is 16
							},
						})
						.from(element)
						.save();
				} catch (e) {
					setErrorNotification(e);
				} finally {
					this.saving = false;
				}
			}, 10);
		},
	},
	computed: {
		...mapStores(useMainStore),
		eventName(): string {
			return this.mainStore.getEventById(this.eventId).name;
		},
		instancesAsSlotArrays(): EventParticipationSlot[][] {
			return this.instances.map(i => i.map(e => getFakeEventParticipationSlot(e)));
		},
		instancesAsSelectableOptions(): SelectableOption[] {
			return this.instances.map((i, j) => ({
				value: j,
				content: _("misc.example") + " " + (j + 1),
			}));
		},
	},
});
</script>

<style></style>
