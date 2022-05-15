/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */

import { getCourse, getCourses, getTags } from "@/api/courses";
import { getMe, updateUser } from "@/api/users";
import { User } from "@/models";

import axios from "axios";
import { Commit } from "vuex";

export const actions = {
  // converts a token issued by Google to a token usable to authenticate requests to the backend
  convertToken: ({ commit }: { commit: Commit }, token: string) => {
    return new Promise((resolve, reject) => {
      axios
        .post("/users/auth/convert-token/", {
          token,
          grant_type: "convert_token",
          client_id: process.env.VUE_APP_GOOGLE_OAUTH_CLIENT_ID,
          client_secret: process.env.VUE_APP_GOOGLE_OAUTH_CLIENT_SECRET,
          backend: "google-oauth2",
        })
        .then((response) => {
          commit("setToken", response.data.access_token);
          commit("setRefreshToken", response.data.refresh_token);
          resolve(response);
        })
        .catch((error) => {
          reject(error);
        });
    });
  },
  getUserData: async ({ commit }: { commit: Commit }) => {
    const response = await getMe();
    commit("setUser", { user: response });
  },
  updateUser: async (
    { commit }: { commit: Commit },
    { userId, changes }: { userId: string; changes: Partial<User> }
  ) => {
    const response = await updateUser(userId, changes);
    commit("setUser", { user: response });
  },
  getCourse: async (
    { commit }: { commit: Commit },
    { courseId }: { courseId: string }
  ) => {
    const { participations, ...course } = await getCourse(courseId);
    console.log("GOTTEN COURSE", course);
    commit("setCourse", course);

    if (participations) {
      commit("student/setEventParticipations", participations, {
        root: true,
      });
    }
  },
  getCourses: async ({ commit }: { commit: Commit }) => {
    const courses = await getCourses();
    commit("setCourses", courses);
  },
  getTags: async (
    { commit }: { commit: Commit },
    {
      courseId,
      includeExerciseCount = false,
    }: { courseId: string; includeExerciseCount: boolean }
  ) => {
    const tags = await getTags(courseId, includeExerciseCount);
    commit("setTags", tags);
  },
};
