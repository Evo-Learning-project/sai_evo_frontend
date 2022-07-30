<template>
  <div class="relative flex w-full card card-border">
    <div class="flex flex-col w-full">
      <!-- main -->
      <div class="flex h-full">
        <!-- voting -->
        <div class="h-full px-3 pt-4 -mt-4 -ml-5 rounded-tl-sm bg-gray-50">
          <div class="sticky flex flex-col space-y-6 top-18">
            <Btn
              :variant="'icon'"
              :size="'lg'"
              :outline="true"
              class=""
              :tooltip="$t('exercise_solution.like')"
              ><span
                class="material-icons-outlined"
                style="font-size: 35px !important"
              >
                thumb_up_alt</span
              ></Btn
            >

            <Btn
              :variant="'icon'"
              :size="'lg'"
              :outline="true"
              class=""
              :tooltip="$t('exercise_solution.dislike')"
              ><span
                class="material-icons-outlined"
                style="font-size: 35px !important"
              >
                thumb_down_alt</span
              ></Btn
            >
          </div>
        </div>

        <div class="">
          <!-- content -->
          <div class="w-full whitespace-pre">
            <ProcessedTextFragment
              v-if="true"
              style="white-space: break-spaces"
              class="w-full px-4 py-2 rounded"
              :value="solution.content"
            ></ProcessedTextFragment>
          </div>

          <div class="flex w-full pb-2 mt-2 mb-4 border-b-2 border-gray-50">
            <!-- actions -->
            <div class="flex ml-2">
              <Btn
                v-if="canEdit"
                :variant="'icon'"
                :outline="true"
                :tooltip="$t('exercise_solution.edit')"
                ><span class="material-icons">edit</span></Btn
              >
              <Btn
                :variant="'icon'"
                :outline="true"
                :tooltip="$t('exercise_solution.share')"
                ><span class="material-icons">share</span></Btn
              >
              <Btn
                :variant="'icon'"
                :outline="true"
                :tooltip="$t('exercise_solution.bookmark')"
                ><span class="material-icons-outlined"
                  >bookmark_outline</span
                ></Btn
              >
            </div>

            <!-- author -->
            <div class="flex items-center ml-auto">
              <Avatar class="ml-auto mr-2" :user="solution.user" />
              <p class="mr-5 text-muted">{{ authorName }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- comments -->
      <div class="w-full">
        <h5 class="mb-2">Commenti</h5>
        <div>
          <div
            v-for="comment in solution.comments"
            :key="'comment-' + comment.id"
            class="my-1.5"
          >
            <ExerciseSolutionComment :comment="comment" />
          </div>
        </div>

        <!-- add comment -->
        <div class="flex items-center w-full mt-4 space-x-2">
          <Avatar class="px-3 my-auto" :user="user" />
          <TextInput
            class="w-full"
            v-model="draftComment"
            :placeholder="'Aggiungi commento'"
          />
          <Btn :variant="'secondary'">
            <span class="material-icons">send</span>
          </Btn>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { ExerciseSolution } from "@/models";
import { defineComponent, PropType } from "@vue/runtime-core";
import Btn from "@/components/ui/Btn.vue";
import TextInput from "@/components/ui/TextInput.vue";
import Avatar from "@/components/ui/Avatar.vue";
import { mapState } from "vuex";
import ExerciseSolutionComment from "./ExerciseSolutionComment.vue";
import ProcessedTextFragment from "@/components/ui/ProcessedTextFragment.vue";
//import { v4 as uuid4 } from "uuid";
export default defineComponent({
  name: "ExerciseSolution",
  props: {
    solution: {
      type: Object as PropType<ExerciseSolution>,
      required: true,
    },
    canVote: {
      type: Boolean,
      default: true,
    },
    canChangeState: {
      type: Boolean,
      default: false,
    },
    canComment: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      draftComment: "",
      //solutionId: uuid4(),
    };
  },
  methods: {},
  computed: {
    ...mapState("shared", ["user"]),
    authorName(): string {
      return this.solution.user?.full_name ?? "Autore";
    },
    canEdit(): boolean {
      return true;
    },
  },
  components: {
    Btn,
    TextInput,
    Avatar,
    ExerciseSolutionComment,
    ProcessedTextFragment,
  },
});
</script>

<style></style>
