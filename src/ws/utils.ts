import { SharedState } from "./../store/types";
import store from "@/store";
import axios from "axios";

export const openAuthenticatedWsConnection = (route: string): WebSocket => {
  const wsScheme = window.location.protocol === "https:" ? "wss" : "ws";

  const socket = new WebSocket(
    wsScheme +
      "://" +
      (axios.defaults.baseURL as string).split("://")[1] +
      "/ws/" +
      route +
      "/?token=" +
      (store.state as { shared: SharedState }).shared.token
  );

  console.log("SOCKET", socket);

  return socket;
};
