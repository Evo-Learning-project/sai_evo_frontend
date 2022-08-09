/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { EventParticipation, Exercise } from "@/models";
import { actions } from "./actions";
import { getters } from "./getters";
import { mutations } from "./mutations";

export const studentStore = {
	namespaced: true,
	state: () => ({
		currentEventParticipation: null as EventParticipation | null,
		eventParticipations: [] as EventParticipation[],
		editingEvent: null as Event | null,
		previewingEvent: null as Event | null,
		exerciseThreads: [] as Exercise[],
	}),
	mutations: {
		...mutations,
	},
	actions: {
		...actions,
	},
	getters: {
		...getters,
	},
};
