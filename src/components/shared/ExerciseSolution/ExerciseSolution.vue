<template>
  <div class="relative flex w-full card card-border">
    <div class="flex flex-col w-full">
      <!-- main -->
      <div class="flex h-full">
        <!-- voting -->
        <div class="h-full px-3 pt-4 pb-4 -mt-4 -ml-5 rounded-tl-sm bg-gray-50">
          <div class="sticky flex flex-col items-center pb-4 space-y-4 top-18">
            <Btn :disabled="voting" :variant="'icon'" :size="'lg'" :outline="true" class=""
              @click="onVote(VoteType.UP_VOTE)" :tooltip="$t('exercise_solution.like')"><span
                :class="[solution.has_upvote ? 'material-icons' : 'material-icons-outlined']"
                style="font-size: 35px !important">
                thumb_up_alt</span></Btn>
            <p class="text-4xl text-muted">{{ solution.score }}</p>
            <Btn :disabled="voting" :variant="'icon'" :size="'lg'" @click="onVote(VoteType.DOWN_VOTE)" :outline="true"
              class="" :tooltip="$t('exercise_solution.dislike')"><span
                :class="[solution.has_downvote ? 'material-icons' : 'material-icons-outlined']"
                style="font-size: 35px !important">
                thumb_down_alt</span></Btn>
          </div>
        </div>
        <!-- right-side pane -->
        <div class="flex flex-col w-full h-full -mt-4 bg-black bg-opacity-0">
          <!-- content -->
          <div ref="content" class="relative w-full pt-4 mb-auto whitespace-pre"
            :class="{ 'h-full': !collapsed, 'overflow-hidden': collapsed }" :style="
              collapsed ? 'max-height: ' + MAX_CONTENT_HEIGHT_PX + 'px' : ''
            ">
            <ProcessedTextFragment v-if="true" style="white-space: break-spaces" class="w-full px-4 py-2 rounded"
              :value="solution.content"></ProcessedTextFragment>
            <div v-if="collapsed" class="absolute bottom-0 left-0 flex w-full h-40 hidden-content">
              <Btn @click="collapsed = false" :variant="'primary-borderless'" class="z-20 mx-auto mt-auto mb-2">{{
                  $t("exercise_solution.reveal_solution")
              }}</Btn>
            </div>
          </div>

          <div class="flex w-full pb-2 mt-2 border-b-2 border-gray-50">
            <!-- actions -->
            <div class="flex ml-2">
              <Btn v-if="canEdit" :variant="'icon'" :outline="true" :tooltip="$t('exercise_solution.edit')"><span
                  class="material-icons">edit</span></Btn>
              <Btn :variant="'icon'" :outline="true" :tooltip="$t('exercise_solution.share')"><span
                  class="material-icons">share</span></Btn>
              <Btn :variant="'icon'" :outline="true" :tooltip="$t('exercise_solution.bookmark')"><span
                  class="material-icons-outlined">bookmark_outline</span></Btn>
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
          <div v-for="comment in solution.comments" :key="'comment-' + comment.id" class="my-1.5">
            <ExerciseSolutionComment :comment="comment" />
          </div>
        </div>

        <!-- add comment -->
        <div class="flex items-center w-full mt-4 space-x-2">
          <Avatar class="px-3 my-auto" :user="user" />
          <TextInput class="w-full" v-model="draftComment" :placeholder="'Aggiungi commento'" />
          <Btn :loading="postingComment" :variant="'secondary'" :disabled="draftComment.trim().length === 0"
            @click="onAddComment()">
            <span class="material-icons">send</span>
          </Btn>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
const MAX_CONTENT_HEIGHT_PX = 300;
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
import { mapActions, mapState } from "vuex";
import ExerciseSolutionComment from "./ExerciseSolutionComment.vue";
import ProcessedTextFragment from "@/components/ui/ProcessedTextFragment.vue";
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
  mounted() {
    const contentElement = this.$refs.content as HTMLElement;
    if (contentElement.clientHeight > this.MAX_CONTENT_HEIGHT_PX) {
      this.collapsed = true;
    }
  },
  data() {
    return {
      voting: false,
      postingComment: false,
      draftComment: "",
      VoteType,
      MAX_CONTENT_HEIGHT_PX,
      collapsed: false,
      //solutionId: uuid4(),
    };
  },
  methods: {
    ...mapActions("student", ["addExerciseSolutionComment", "addExerciseSolutionVote"]),
    async onVote(voteType: VoteType) {
      this.voting = true;
      try {
        const vote = (this.solution.has_upvote && voteType === VoteType.UP_VOTE ||
          this.solution.has_downvote && voteType === VoteType.DOWN_VOTE)
          ? undefined : // removing vote
          getVote(voteType) // adding/updating vote

        // TODO show animation/micro interaction
        await this.addExerciseSolutionVote({
          courseId: this.courseId,
          exerciseId: this.exercise.id,
          solutionId: this.solution.id,
          vote
        });
        // TODO fix this with an action
        // eslint-disable-next-line vue/no-mutating-props
        // this.solution.votes.push(getVote(voteType));
      } catch (e) {
        setErrorNotification(e);
      } finally {
        this.voting = false;
      }
    },
    async onAddComment() {
      this.postingComment = true;
      try {
        await this.addExerciseSolutionComment({
          courseId: this.courseId,
          exerciseId: this.exercise.id,
          solutionId: this.solution.id,
          comment: getComment(this.draftComment),
        });
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
    // score(): number {
    //   return this.solution.votes
    //     .map((v) => (v.vote_type === VoteType.UP_VOTE ? 1 : -1))
    //     .reduce((a, b) => a + b, 0);
    // },
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

<style>
</style>
