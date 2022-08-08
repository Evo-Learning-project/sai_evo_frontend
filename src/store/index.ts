/* eslint-disable @typescript-eslint/no-explicit-any */

import { createStore } from "vuex";
import { sharedStore } from "./shared";
import { teacherStore } from "./teacher";
import { studentStore } from "./student";

// import VuexPersistence from 'vuex-persist';

// const vuexLocal = new VuexPersistence({
//   storage: window.localStorage,
//   modules: ['shared'],
//   reducer: (state: { shared: any }) => ({
//     user: state.shared.user,
//     token: state.shared.token,
//     refreshToken: state.shared.refreshToken,
//   }),
// });
export default createStore({
	modules: {
		shared: sharedStore,
		teacher: teacherStore,
		student: studentStore,
	},
});
