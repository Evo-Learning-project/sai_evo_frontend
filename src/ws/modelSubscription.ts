import { convertEventTemplateRules } from "@/api/utils";
import { Event } from "@/models";
import store from "@/store";
import { openAuthenticatedWsConnection } from "./utils";

export const subscribeToEventChanges = (eventId: string, lock = true) => {
  const socket = openAuthenticatedWsConnection("events");
  const subscriptionMessage = {
    action: "subscribe_instance",
    pk: eventId,
    request_id: 42, // TODO generate random request id
    lock,
  };
  socket.onopen = () => socket.send(JSON.stringify(subscriptionMessage));
  socket.onmessage = (m) => {
    console.log("WS MSG", JSON.parse(m.data));
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

      console.log("converted event", convertedEvent);
      store.commit("teacher/setEvent", {
        eventId: convertedEvent.id,
        payload: convertedEvent,
      });
    }
  };
  return socket;
};
