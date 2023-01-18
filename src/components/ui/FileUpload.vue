<template>
	<div class="w-full darken-on-hover">
		<div class="w-full relative">
			<LinearProgress
				v-if="uploading"
				:progress="uploadProgress"
				class="rounded-t absolute top-0 z-10"
			/>
			<div
				v-if="disabled"
				class="absolute top-0 w-full h-44 z-10 bg-red-500 bg-opacity-0"
			></div>
			<VueUploadComponent
				class="w-full"
				@input-filter="inputFilter"
				@input-file="inputFile"
				ref="upload"
				:drop="true"
				v-model="files"
				:custom-action="emitUpload"
				:input-id="elementId"
			>
				<div
					:class="[!small ? 'h-44' : 'h-20']"
					class="
						relative
						flex
						border-2 border-gray-200 border-dashed
						rounded
						cursor-pointer
						w-full
						bg-light
					"
				>
					<div :class="{ invisible: files.length > 0 }" class="p-4 mx-auto my-auto">
						<p
							class="opacity-30 material-icons-outlined"
							:class="[!small ? 'text-5xl' : 'text-3xl -mt-1.5']"
						>
							{{ disabled ? "file_download_off" : "cloud_upload" }}
						</p>
						<p class="opacity-60" :class="[!small ? '' : '-mt-2 text-sm']">
							{{ disabled ? $t("misc.file_upload_no_files") : $t("misc.file_upload") }}
						</p>
					</div>
					<div v-if="files.length > 0" class="absolute flex w-full">
						<div
							class="
								relative
								flex flex-col
								items-center
								mx-auto
								space-x-2
								align-middle
								z-20
								w-max
								p-8
								pt-0
							"
							v-for="(file, index) in files"
							:key="'file-' + index + '-' + file.id"
						>
							<!-- <span
                class="material-icons-outlined text-success absolute top-0 right-0 mt-4 mr-4"
                v-if="file.success"
                >done</span
              > -->
							<div
								@click="download"
								:class="[small ? 'py-4' : 'py-16']"
								class="
									absolute
									z-50
									top-0
									hover:bg-opacity-40
									transition-all
									duration-75
									hover:opacity-100 hover:bg-gray-500
									opacity-0
									w-full
								"
							>
								<span class="material-icons-outlined opacity-100 text-gray-50 text-5xl">
									cloud_download
								</span>
							</div>
							<AnimatedIcon
								class="absolute top-0 right-0 mt-2 mr-3"
								v-if="false && file.success"
							></AnimatedIcon>
							<img
								class=""
								:class="[small ? 'w-10 h-10 mt-2' : 'w-28 h-28 mt-7']"
								v-if="file.thumb"
								:src="file.thumb"
							/>
							<span
								v-else
								class="material-icons-outlined text-gray-400"
								:class="[small ? 'text-3xl mt-2.5' : 'text-5xl mt-12']"
							>
								insert_drive_file
							</span>
							<!-- <img class="mt-4 w-28 h-28" v-else src="../../../public/pdf_thmb.png" /> -->
							<p class="text-base text-muted">{{ file.name }}</p>
						</div>
					</div>
				</div>
			</VueUploadComponent>
		</div>

		<p v-if="!showUpload && showMaxSize && !fileTooBig" class="mt-2 text-sm text-muted">
			<span class="material-icons-outlined inline-icon mr-1">info</span>
			{{ $t("misc.max_upload_size_is") }} {{ humanReadableMaxUploadSize }}
		</p>

		<p
			v-else-if="fileTooBig"
			class="mt-2 text-sm text-muted text-danger-dark"
			:class="{ shake: fileTooBigTextShake }"
			@animationend="fileTooBigTextShake = false"
		>
			<span class="material-icons-outlined inline-icon mr-1">info</span>
			<span>{{ $t("misc.file_too_big") }}.</span>
			{{ $t("misc.max_upload_size_is") }} {{ humanReadableMaxUploadSize }}
		</p>

		<Btn
			v-if="!disabled && showUpload"
			class="mt-4"
			:loading="$refs.upload?.active"
			@click.prevent="$refs.upload.active = true"
			><span class="mr-2 text-xl material-icons-outlined">cloud_upload</span>
			Carica
		</Btn>
	</div>
</template>

<script lang="ts">
import { defineComponent } from "@vue/runtime-core";
import { PropType } from "vue";

import VueUploadComponent from "vue-upload-component";
import Btn from "./Btn.vue";
import AnimatedIcon from "./AnimatedIcon.vue";
import { loadingMixin } from "@/mixins";
import { v4 as uuid4 } from "uuid";
import { mapStores } from "pinia";
import { useMetaStore } from "@/stores/metaStore";
import LinearProgress from "./LinearProgress.vue";
import {
	getDefaultThumbnail,
	getHumanFileSize,
	getMaxUploadFileSizeBytes,
} from "@/utils";

export default defineComponent({
	name: "FileUpload",
	mixins: [loadingMixin],
	components: {
		VueUploadComponent,
		Btn,
		AnimatedIcon,
		LinearProgress,
	},
	props: {
		small: {
			type: Boolean,
			default: false,
		},
		maxFilesNum: {
			type: Number,
			default: 1,
		},
		modelValue: {
			type: Array as PropType<any[]>,
			required: true,
		},
		disabled: {
			type: Boolean,
			default: false,
		},
		autoUpload: {
			type: Boolean,
			default: false,
		},
		uploading: {
			type: Boolean,
			default: false,
		},
		uploadProgress: {
			type: Number,
			required: false,
		},
		clearImmediately: {
			type: Boolean,
			default: false,
		},
		showMaxSize: {
			type: Boolean,
			default: false,
		},
	},
	watch: {
		uploading(newVal) {
			if (!newVal && this.clearImmediately) {
				this.files = [];
			}
		},
		// TODO probably useless
		refUploading(newVal) {
			if (!newVal) {
				this.showUpload = false;
			}
		},
		fileTooBig(newVal) {
			this.fileTooBigTextShake = newVal;
		},
	},
	data() {
		return {
			files: [] as any,
			minSize: 0,
			maxSize: 1000000000,
			showUpload: false,
			elementId: uuid4(),
			fileTooBig: false,
			fileTooBigTextShake: false,
		};
	},
	created() {
		this.files = this.modelValue;
	},
	methods: {
		download() {
			this.$emit("download");
		},
		async emitUpload(
			file: { blob: Blob }, //VueUploadItem,
			component: any,
		) {
			const fileBlob = file.blob;
			this.$emit("update:modelValue", fileBlob);

			return component;
		},
		inputFilter(
			newFile: {
				name: string;
				file: Blob;
				error: string;
				type: string;
				size: number;
				blob: Blob;
				thumb: string;
			},
			oldFile: { file: any; blob: any },
			prevent: () => any,
		) {
			this.fileTooBig = false;

			const mimeType = newFile.type;
			const isImage = mimeType.substring(0, 6) === "image/";

			if (newFile.file.size > getMaxUploadFileSizeBytes()) {
				this.$emit("fileTooBig");
				// without this, the watcher for fileTooBig won't detect both changes
				// (the one above to false and this one) and the shake animation on
				// the warning text won't be re-triggered
				this.$nextTick(() => (this.fileTooBig = true));
				return prevent();
			}
			if (
				newFile &&
				newFile.error === "" &&
				newFile.file &&
				(!oldFile || newFile.file !== oldFile.file)
			) {
				newFile.blob = newFile.file;
				newFile.thumb = "";
				if (newFile.blob && isImage) {
					newFile.thumb = URL.createObjectURL(newFile.file);
				} else {
					newFile.thumb = getDefaultThumbnail(mimeType);
				}
			}
			// image size
			if (
				newFile &&
				newFile.error === "" &&
				isImage &&
				newFile.blob &&
				(!oldFile || newFile.blob !== oldFile.blob)
			) {
				newFile.error = "image parsing";
				let img = new Image();
				img.onload = () => {
					(this.$refs as any).upload.update(newFile, {
						error: "",
						height: img.height,
						width: img.width,
					});
				};
				img.onerror = (e: any) => {
					(this.$refs as any).upload.update(newFile, {
						error: "parsing image size",
					});
				};
				img.src = URL.createObjectURL(newFile.file); // newFile.blob;
			}
		},
		// add, update, remove File Event
		inputFile(
			newFile: {
				active: any;
				size: number;
				progress: any;
				error: any;
				success: any;
			},
			oldFile: {
				active: any;
				progress: any;
				error: any;
				success: any;
				response: { id: any };
			},
		) {
			if (newFile && oldFile) {
				this.showUpload = true;
				// update
				if (newFile.active && !oldFile.active) {
					// beforeSend
					// min size
					if (newFile.size >= 0 && this.minSize > 0 && newFile.size < this.minSize) {
						(this.$refs as any).upload.update(newFile, { error: "size" });
					}
				}
				if (newFile.progress !== oldFile.progress) {
					// progress
				}
				if (newFile.error && !oldFile.error) {
					console.log("error uploading file");
					(this.$refs as any).upload.active = false;
				}
				if (newFile.success && !oldFile.success) {
					this.showUpload = false;
				}
			}
			if (!newFile && oldFile) {
				// remove
				if (oldFile.success && oldFile.response?.id) {
					// delete
				}
			}
			// Automatically activate upload
			if (Boolean(newFile) !== Boolean(oldFile) || oldFile.error !== newFile.error) {
				if (!this.autoUpload) {
					this.showUpload = true;
				}

				if (this.autoUpload && !(this.$refs as any).upload.active) {
					(this.$refs as any).upload.active = true;
				}
			}
		},
	},
	computed: {
		...mapStores(useMetaStore),
		refUploading(): boolean {
			return !!(this.$refs as any).upload?.active;
		},
		humanReadableMaxUploadSize() {
			return getHumanFileSize(getMaxUploadFileSizeBytes());
		},
	},
});
</script>

<style></style>
