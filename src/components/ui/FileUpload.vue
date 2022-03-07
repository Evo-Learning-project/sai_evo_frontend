<template>
  <div>
    <div>
      <VueUploadComponent
        @input-filter="inputFilter"
        @input-file="inputFile"
        ref="upload"
        v-model="files"
        :custom-action="emitUpload"
      >
        <div
          style="width: 30rem"
          class="relative flex text-xl border-2 border-gray-200 border-dashed rounded cursor-pointer  h-44 hover:bg-gray-200 bg-light"
        >
          <div
            :class="{ invisible: files.length > 0 }"
            class="p-4 mx-auto my-auto"
          >
            <p class="opacity-60">{{ $t("misc.file_upload") }}</p>
            <p
              class="opacity-30 material-icons-outlined"
              style="font-size: 6rem"
            >
              cloud_upload
            </p>
          </div>
          <div v-if="files.length > 0" class="absolute flex w-full">
            <div
              class="flex flex-col items-center w-full mx-auto space-x-2 align-middle "
              v-for="(file, index) in files"
              :key="'file-' + index + '-' + file.id"
            >
              <img class="mt-4 w-28 h-28" v-if="file.thumb" :src="file.thumb" />
              <p class="text-base text-muted">{{ file.name }}</p>
            </div>
          </div>
        </div>
      </VueUploadComponent>
    </div>

    <Btn
      v-if="!$refs.upload || !$refs.upload.active"
      @click.prevent="$refs.upload.active = true"
      ><span class="mr-2 text-xl material-icons-outlined"> cloud_upload </span>
      Carica
    </Btn>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "@vue/runtime-core";

import VueUploadComponent from "vue-upload-component";
import Btn from "./Btn.vue";

export default defineComponent({
  name: "FileUpload",
  components: {
    VueUploadComponent,
    Btn,
  },
  props: {
    maxFilesNum: {
      type: Number,
      default: 1,
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
  methods: {
    async emitUpload(
      file: any, //VueUploadItem,
      component: any
    ) {
      console.log("FFFFILE", file.blob, component);

      const fileBlob = await fetch(file.blob).then((r) => r.blob());

      console.log("BLOB", fileBlob);
      this.$emit("update:modelValue", fileBlob);

      return component;
    },
    doUpload() {
      1;
    },
    inputFilter(
      newFile: {
        name: string;
        file: Blob | MediaSource;
        error: string;
        type: string;
        size: number;
        blob: string;
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
        // Create a blob field
        newFile.blob = "";
        let URL = window.URL || window.webkitURL;
        if (URL) {
          newFile.blob = URL.createObjectURL(newFile.file);
        }
        // Thumbnails
        newFile.thumb = "";
        if (newFile.blob && isImage) {
          newFile.thumb = newFile.blob;
        }
        // TODO thumbnails for other file types
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
        img.src = newFile.blob;
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
          if (
            newFile.size >= 0 &&
            this.minSize > 0 &&
            newFile.size < this.minSize
          ) {
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
        if (oldFile.success && oldFile.response.id) {
          // delete
        }
      }
      // Automatically activate upload
      if (
        Boolean(newFile) !== Boolean(oldFile) ||
        oldFile.error !== newFile.error
      ) {
        if (this.uploadAuto && !(this.$refs as any).upload.active) {
          (this.$refs as any).upload.active = true;
        }
      }
    },
  },
});
</script>

<style></style>
