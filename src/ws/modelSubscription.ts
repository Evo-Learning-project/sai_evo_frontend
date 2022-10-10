import { SharedState } from "./../store/types";
import store from "@/store";
import { getWsRequestId, openAuthenticatedWsConnection } from "./utils";
import { normalizeIncomingEvent, normalizeIncomingExercise } from "@/api";
import { getters } from "@/store/teacher";

const getCurrentUserId = () => (store.state as { shared: SharedState }).shared.user.id;

export const subscribeToExerciseChanges = async (exerciseId: string, lock = true) => {
	const subscriptionMessage = {
		action: "subscribe_instance",
		pk: exerciseId,
		request_id: getWsRequestId(),
		lock,
	};
	const socket = await openAuthenticatedWsConnection(
		"exercises",
		s => s.send(JSON.stringify(subscriptionMessage)),
		m => {
			const payload = JSON.parse(m.data);
			console.log("MSG", payload);

			if (payload.action === "update") {
				const convertedExercise = normalizeIncomingExercise(payload.data);
				const currentExerciseLock =
					getters.exercise(store.state.teacher)(convertedExercise.id).locked_by?.id ?? "";

				if (currentExerciseLock != getCurrentUserId()) {
					// update local object if edit is done by another user
					store.commit("teacher/setExercise", convertedExercise);
				}
			}
		},
	);
	return socket;
};

export const subscribeToSubmissionSlotChanges = async (slotId: string) => {
	const subscriptionMessage = {
		action: "subscribe_instance",
		pk: slotId,
		request_id: getWsRequestId(),
	};
	const socket = await openAuthenticatedWsConnection(
		"submission_slots",
		s => s.send(JSON.stringify(subscriptionMessage)),
		m => {
			const payload = JSON.parse(m.data);
			if (payload.action === "execution_results") {
				store.commit("student/patchCurrentEventParticipationSlot", {
					slotId,
					changes: { execution_results: payload.data },
				});
			}
		},
	);
	return socket;
};

export const subscribeToEventChanges = async (eventId: string, lock = true) => {
	const subscriptionMessage = {
		action: "subscribe_instance",
		pk: eventId,
		request_id: getWsRequestId(),
		lock,
	};
	const socket = await openAuthenticatedWsConnection(
		"events",
		s => s.send(JSON.stringify(subscriptionMessage)),
		m => {
			const payload = JSON.parse(m.data);
			if (payload.action === "update") {
				const convertedEvent = normalizeIncomingEvent(payload.data);
				const currentEventLock =
					getters.event(store.state.teacher)(convertedEvent.id).locked_by?.id ?? "";

				if (currentEventLock != getCurrentUserId()) {
					// update local object if edit is done by another user
					store.commit("teacher/setEvent", {
						eventId: convertedEvent.id,
						payload: convertedEvent,
					});
				}
			}
		},
	);
	return socket;
};
