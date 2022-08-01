<template>
  <div class="relative flex w-full card card-border">
    <div class="flex flex-col w-full">
      <!-- main -->
      <div class="flex h-full">
        <!-- voting -->
        <div class="h-full px-3 pt-4 pb-4 -mt-4 -ml-5 rounded-tl-sm bg-gray-50">
          <div class="sticky flex flex-col items-center space-y-4 top-18">
            <Btn
              :variant="'icon'"
              :size="'lg'"
              :outline="true"
              class=""
              @click="onVote(VoteType.UP_VOTE)"
              :tooltip="$t('exercise_solution.like')"
              ><span
                class="material-icons-outlined"
                style="font-size: 35px !important"
              >
                thumb_up_alt</span
              ></Btn
            >
            <p class="text-4xl text-muted">{{ score }}</p>
            <Btn
              :variant="'icon'"
              :size="'lg'"
              @click="onVote(VoteType.DOWN_VOTE)"
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
        <!-- right-side pane -->
        <div class="flex flex-col w-full h-full -mt-4 bg-black bg-opacity-0">
          <!-- content -->
          <div class="w-full h-full pt-4 mb-auto whitespace-pre">
            <ProcessedTextFragment
              v-if="true"
              style="white-space: break-spaces"
              class="w-full px-4 py-2 rounded"
              :value="solution.content"
            ></ProcessedTextFragment>
          </div>

          <div class="flex w-full pb-2 mt-2 border-b-2 border-gray-50">
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
          <Btn
            :loading="postingComment"
            :variant="'secondary'"
            :disabled="draftComment.trim().length === 0"
            @click="onAddComment()"
          >
            <span class="material-icons">send</span>
          </Btn>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import {
  Exercise,
  ExerciseSolution,
  getComment,
  getVote,
  VoteType,
} from "@/models";
import { defineComponent, PropType } from "@vue/runtime-core";
import Btn from "@/components/ui/Btn.vue";
import TextInput from "@/components/ui/TextInput.vue";
import Avatar from "@/components/ui/Avatar.vue";
import { mapState } from "vuex";
import ExerciseSolutionComment from "./ExerciseSolutionComment.vue";
import ProcessedTextFragment from "@/components/ui/ProcessedTextFragment.vue";
import {
  createExerciseSolutionComment,
  voteExerciseSolution,
} from "@/api/exercises";
import { courseIdMixin } from "@/mixins";
import { setErrorNotification } from "@/utils";
//import { v4 as uuid4 } from "uuid";
export default defineComponent({
  name: "ExerciseSolution",
  mixins: [courseIdMixin],
  props: {
    exercise: {
      type: Object as PropType<Exercise>,
      required: true,
    },
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
      voting: false,
      postingComment: false,
      draftComment: "",
      VoteType,
      //solutionId: uuid4(),
    };
  },
  methods: {
    async onVote(voteType: VoteType) {
      this.voting = true;
      try {
        // TODO show animation/micro interaction
        await voteExerciseSolution(
          this.courseId,
          this.exercise.id,
          this.solution.id,
          voteType
        );
        // TODO fix this with an action
        // eslint-disable-next-line vue/no-mutating-props
        this.solution.votes.push(getVote(voteType));
      } catch (e) {
        setErrorNotification(e);
      } finally {
        this.voting = false;
      }
    },
    async onAddComment() {
      this.postingComment = true;
      try {
        const newComment = await createExerciseSolutionComment(
          this.courseId,
          this.exercise.id,
          this.solution.id,
          getComment(this.draftComment)
        );
        // TODO fix this with an action
        // eslint-disable-next-line vue/no-mutating-props
        this.solution.comments.push(newComment);
        this.draftComment = "";
      } catch (e) {
        setErrorNotification(e);
      } finally {
        this.postingComment = false;
      }
    },
  },
  computed: {
    ...mapState("shared", ["user"]),
    authorName(): string {
      return this.solution.user?.full_name ?? "Autore"; // TODO change default
    },
    canEdit(): boolean {
      return true;
    },
    score(): number {
      return this.solution.votes
        .map((v) => (v.vote_type === VoteType.UP_VOTE ? 1 : -1))
        .reduce((a, b) => a + b, 0);
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
