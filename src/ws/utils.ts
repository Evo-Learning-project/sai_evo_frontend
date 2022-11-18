// import { SharedState } from "./../store/types";
// import store from "@/store";
// import axios from "axios";
// import { random } from "lodash";

// export const getWsRequestId = () => random(1, 1000);

// export const openAuthenticatedWsConnection = (
// 	route: string,
// 	onOpen: (s: WebSocket) => void,
// 	onMessage: (this: WebSocket, ev: MessageEvent<any>) => any,
// ): Promise<WebSocket> =>
// 	new Promise((resolve, reject) => {
// 		const wsScheme = window.location.protocol === "https:" ? "wss" : "ws";

// 		const socket = new WebSocket(
// 			wsScheme +
// 				"://" +
// 				(axios.defaults.baseURL as string).split("://")[1] +
// 				"/ws/" +
// 				route +
// 				"/?token=" +
// 				(store.state as { shared: SharedState }).shared.token,
// 		);
// 		socket.onopen = () => {
// 			onOpen(socket);
// 			resolve(socket);
// 		};
// 		socket.onmessage = onMessage;
// 		socket.onerror = error => reject(error);
// 	});
