<template>
  <div class="w-full">
    <div class="w-full relative">
      <div
        v-if="disabled"
        class="absolute top-0 w-full h-44 z-10 bg-red-500 bg-opacity-0"
      ></div>
      <VueUploadComponent
        class="w-full"
        @input-filter="inputFilter"
        @input-file="inputFile"
        ref="upload"
        v-model="files"
        :custom-action="emitUpload"
      >
        <div
          style="width: 100%"
          class="relative flex text-xl border-2 border-gray-200 border-dashed rounded cursor-pointer h-44 bg-light"
        >
          <div :class="{ invisible: files.length > 0 }" class="p-4 mx-auto my-auto">
            <p class="opacity-60 mb-4">
              {{ disabled ? $t("misc.file_upload_no_files") : $t("misc.file_upload") }}
            </p>
            <p class="opacity-30 material-icons-outlined" style="font-size: 4rem">
              {{ disabled ? "file_download_off" : "cloud_upload" }}
            </p>
          </div>
          <div v-if="files.length > 0" class="absolute flex w-full">
            <div
              class="relative flex flex-col items-center mx-auto space-x-2 align-middle z-20 w-max p-8 pt-0"
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
                class="absolute z-50 top-0 py-16 hover:bg-opacity-70 transition-all duration-75 hover:opacity-100 hover:bg-gray-700 opacity-0 w-full"
              >
                <span
                  style="font-size: 4rem"
                  class="material-icons-outlined opacity-100 text-gray-50"
                >
                  cloud_download
                </span>
              </div>
              <AnimatedIcon
                class="absolute top-0 right-0 mt-2 mr-3"
                v-if="false && file.success"
              ></AnimatedIcon>
              <img class="mt-7 w-28 h-28" v-if="file.thumb" :src="file.thumb" />
              <span
                v-else
                style="font-size: 4rem"
                class="mt-7 material-icons-outlined text-gray-400"
              >
                insert_drive_file
              </span>
              <!-- <img class="mt-4 w-28 h-28" v-else src="../../../public/pdf_thmb.png" /> -->
              <p class="text-base text-muted mt-4">{{ file.name }}</p>
            </div>
          </div>
        </div>
      </VueUploadComponent>
    </div>

    <Btn
      v-if="!disabled"
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

export default defineComponent({
  name: "FileUpload",
  mixins: [loadingMixin],
  components: {
    VueUploadComponent,
    Btn,
    AnimatedIcon,
  },
  props: {
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
  },
  watch: {
    uploading(newVal) {
      this.$store.state.shared.loading = newVal;
    },
  },
  data() {
    return {
      files: [] as any,
      minSize: 0,
      maxSize: 1000000000,
      uploadAuto: false,
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
      component: any
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
      prevent: () => any
    ) {
      //console.log("INPUT FILTER", newFile);
      console.log("new file", newFile.blob);
      const isImage = newFile.type.substring(0, 6) === "image/";
      if (newFile && !oldFile) {
        // Before adding a file
        // Filter system files or hide files
        if (/(\/|^)(Thumbs\.db|desktop\.ini|\..+)$/.test(newFile.name)) {
          return prevent();
        }
        // Filter php html js file
        if (/\.(php5?|html?|jsx?)$/i.test(newFile.name)) {
          return prevent();
        }
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
          // TODO thumbnails for other file types
          // newFile.thumb = "../../../public/pdf_thumb.png";
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
      }
    ) {
      console.log("INPUT FILE", newFile);
      if (newFile && oldFile) {
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
          console.log("eeeerror");
          (this.$refs as any).upload.active = false;
        }
        if (newFile.success && !oldFile.success) {
          // success
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
        if (this.uploadAuto && !(this.$refs as any).upload.active) {
          (this.$refs as any).upload.active = true;
        }
      }
    },
  },
  computed: {
    uploading(): boolean {
      return !!(this.$refs as any).upload?.active;
    },
  },
});
</script>

<style></style>
