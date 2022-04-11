<template>
  <div class="flex flex-col flex-grow">
    <nav class="relative py-0.5 z-50 md:px-12 bg-primary">
      <div class="px-4 mx-auto sm:px-6 lg:px-8">
        <div class="flex items-center justify-between h-14">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <img class="w-32 -ml-1" src="../../../public/unipi-logo.svg" />
            </div>
          </div>
          <div class="">
            <div
              v-if="$store.getters['shared/isAuthenticated']"
              class="flex items-center ml-4 space-x-2 md:ml-6"
            >
              <p class="text-xs text-lightText md:text-base">
                {{ $store.getters["shared/email"] }}
              </p>
              <p
                @click="onShowMatEdit"
                class="hidden text-xs cursor-pointer  md:block text-lightText md:text-sm"
              >
                {{ $store.state.shared.user?.mat }}
              </p>
              <Btn @click="logOut()" :variant="'icon'" :outline="true"
                ><span class="text-lg text-lightText material-icons-outlined">
                  logout
                </span></Btn
              >
            </div>
          </div>
        </div>
      </div>
    </nav>
    <header
      class="sticky top-0 z-50 bg-indigo-100 shadow-md  md:px-12 bg-opacity-70 backdrop-blur-sm backdrop-filter"
    >
      <div class="flex items-center px-4 py-4 mx-auto sm:px-6 lg:px-8">
        <div class="flex flex-col md:items-center md:space-x-6 md:flex-row">
          <h2 class="mb-0">
            {{ routeTitle }}
          </h2>
          <BreadCrumbs
            v-if="!$route.meta.hideBreadcrumbs"
            :route="$route"
            class="mt-1"
          ></BreadCrumbs>
        </div>
        <div id="main-student-header-right" class="ml-auto"></div>
      </div>
    </header>
    <main class="flex-grow px-2 bg-white md:px-12">
      <div class="h-full py-6 mx-auto sm:px-5 lg:px-8">
        <ErrorView v-if="!!$store.state.shared.pageWideErrorData"></ErrorView>
        <router-view v-else />
        <transition name="quick-bounce"
          ><SnackBar
            class="w-full px-4"
            v-if="$store.state.shared.errorNotificationData"
            :icon="$store.state.shared.errorNotificationData.icon"
            :message="$store.state.shared.errorNotificationData.title"
          ></SnackBar
        ></transition>
      </div>
    </main>
    <Dialog
      :show-dialog="editingMat"
      @no="editingMat = false"
      @yes="onSaveMat()"
      :yes-text="$t('misc.save')"
      :no-text="$t('dialog.default_cancel_text')"
    >
      <template v-slot:title>{{ $t("mat.edit_mat_title") }}</template>
      <template v-slot:body>
        <NumberInput v-model="dirtyMat" class="mt-8">{{
          $t("mat.your_mat")
        }}</NumberInput>
      </template>
    </Dialog>
  </div>
</template>

<script lang="ts">
import { courseIdMixin, eventIdMixin, loadingMixin } from "@/mixins";
import {
  ROUTE_TITLE_COURSE_NAME_TOKEN,
  ROUTE_TITLE_EVENT_NAME_TOKEN,
} from "@/navigation/const";
import { SidebarOption } from "@/navigation/sidebar";
import { defineComponent } from "@vue/runtime-core";
import ErrorView from "../shared/ErrorView.vue";
import SnackBar from "@/components/ui/SnackBar.vue";
import BreadCrumbs from "@/components/ui/BreadCrumbs.vue";
import Btn from "@/components/ui/Btn.vue";
import { logOut } from "@/utils";
import Dialog from "@/components/ui/Dialog.vue";
import { createNamespacedHelpers } from "vuex";
import NumberInput from "@/components/ui/NumberInput.vue";
const { mapState, mapActions } = createNamespacedHelpers("shared");

export default defineComponent({
  name: "MainStudent",
  data() {
    return {
      editingMat: false,
      dirtyMat: "",
    };
  },
  mixins: [courseIdMixin, eventIdMixin, loadingMixin],
  methods: {
    ...mapActions(["updateUser"]),
    replaceTitleTokens(str: string) {
      return str
        ?.replace(ROUTE_TITLE_COURSE_NAME_TOKEN, this.currentCourse.name)
        ?.replace(ROUTE_TITLE_EVENT_NAME_TOKEN, this.currentEvent);
    },
    onShowMatEdit() {
      this.dirtyMat = this.user.mat;
      this.editingMat = true;
    },
    async onSaveMat() {
      await this.withLoading(async () =>
        this.updateUser({
          userId: this.user.id,
          changes: { mat: this.dirtyMat },
        })
      );
      this.editingMat = false;
      this.$store.commit("shared/showSuccessFeedback");
    },
    logOut,
  },
  computed: {
    ...mapState(["user"]),
    sidebarOptions(): SidebarOption[] {
      return (this.$route.meta?.sidebarOptions ?? []) as SidebarOption[];
    },
    routeTitle(): string {
      return this.replaceTitleTokens(this.$route.meta.routeTitle as string);
    },
  },
  components: { ErrorView, SnackBar, BreadCrumbs, Btn, Dialog, NumberInput },
});
</script>
