<template>
  <div class="flex p-4 bg-gray-50">
    <div class="flex flex-col">
      <!-- author -->
      <div class="flex items-center pl-1 space-x-2">
        <!-- avatar -->
        <!-- <div
          class="flex w-8 h-8 rounded-full bg-primary-light text-primary bg-opacity-30"
        >
          <p class="mx-auto my-auto font-semibold">
            {{ authorName[0].toLocaleUpperCase() }}
          </p>
        </div> -->
        <Avatar :user="solution.user" />

        <p class="text-muted">{{ authorName }}</p>
      </div>

      <!-- main -->
      <div class="flex mt-4">
        <!-- voting -->
        <div class="flex flex-col mt-4 space-y-4">
          <Btn :variant="'icon'" :outline="true"
            ><span class="material-icons-outlined"> thumb_up_alt</span></Btn
          >

          <Btn :variant="'icon'" :outline="true"
            ><span class="material-icons-outlined"> thumb_down_alt</span></Btn
          >
        </div>

        <!-- content -->
        <div>
          <slot>
            <!-- <p class="ml-2 text-sm text-muted">
            {{ $t("misc.solution") }}
          </p> -->
            <!-- <ProcessedTextFragment
            style="white-space: break-spaces"
            class="w-full px-4 py-2 rounded"
            :value="solution.content"
          ></ProcessedTextFragment> -->
          </slot>
        </div>
      </div>

      <!-- comments -->
      <div class="mt-4">
        <h5>Commenti</h5>
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
          <Btn :variant="'secondary'" :size="'sm'">
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
  },
  components: { Btn, TextInput, Avatar, ExerciseSolutionComment },
});
</script>

<style></style>
