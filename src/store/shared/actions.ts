/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */

import { getCourse, getCourses, getTags } from "@/api/courses";

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
  getUserData: ({ commit }: { commit: Commit }) => {
    return new Promise((resolve, reject) => {
      axios
        .get("/users/me/")
        .then((response) => {
          commit("setUser", { user: response.data });
          resolve(response);
        })
        .catch((error) => {
          reject(error);
        });
    });
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
  getTags: async ({ commit }: { commit: Commit }, courseId: string) => {
    const tags = await getTags(courseId);
    commit("setTags", tags);
  },
};
