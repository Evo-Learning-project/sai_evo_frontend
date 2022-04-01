import store from "@/store";
import { openAuthenticatedWsConnection } from "./utils";

export const subscribeToEventChanges = (eventId: string, lock = true) => {
  const socket = openAuthenticatedWsConnection("events");
  const message = {
    action: "subscribe_instance",
    pk: eventId,
    request_id: 42,
    lock,
  };
  socket.onopen = () => socket.send(JSON.stringify(message));
  socket.onmessage = (m) => {
    console.log("WS MSG", JSON.parse(m.data));
    const payload = JSON.parse(m.data);

    if (payload.action === "update") {
      store.commit("teacher/setEvent", {
        eventId: payload.data.id,
        payload: payload.data,
      });
    }
  };
  return socket;
};
