import { SharedState } from "./../store/types";
import { Exercise } from "./../models/interfaces";
import { convertEventTemplateRules } from "@/api/utils";
import { Event } from "@/models";
import store from "@/store";
import { getWsRequestId, openAuthenticatedWsConnection } from "./utils";

const getCurrentUserId = () =>
  (store.state as { shared: SharedState }).shared.user.id;

export const subscribeToExerciseChanges = async (
  exerciseId: string,
  lock = true
) => {
  const subscriptionMessage = {
    action: "subscribe_instance",
    pk: exerciseId,
    request_id: getWsRequestId(),
    lock,
  };
  const socket = await openAuthenticatedWsConnection(
    "exercises",
    (s) => s.send(JSON.stringify(subscriptionMessage)),
    (m) => {
      const payload = JSON.parse(m.data);

      if (payload.action === "update") {
        const exercise = payload.data as Exercise;
        if ((exercise.locked_by?.id ?? "") != getCurrentUserId()) {
          // update local object if edit is done by another user
          store.commit("teacher/setExercise", exercise);
        }
      }
    }
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
    (s) => s.send(JSON.stringify(subscriptionMessage)),
    (m) => {
      const payload = JSON.parse(m.data);
      if (payload.action === "execution_results") {
        store.commit("student/patchCurrentEventParticipationSlot", {
          slotId,
          changes: { execution_results: payload.data },
        });
      }
    }
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
    (s) => s.send(JSON.stringify(subscriptionMessage)),
    (m) => {
      const payload = JSON.parse(m.data);

      if (payload.action === "update") {
        const processedRules = convertEventTemplateRules(
          payload.data.template?.rules
        );

        const convertedEvent = {
          ...payload.data,
          template: {
            ...payload.data.template,
            rules: processedRules,
          },
        } as Event;

        if ((convertedEvent.locked_by?.id ?? "") != getCurrentUserId()) {
          // update local object if edit is done by another user
          store.commit("teacher/setEvent", {
            eventId: convertedEvent.id,
            payload: convertedEvent,
          });
        }
      }
    }
  );
  return socket;
};
