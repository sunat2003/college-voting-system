import { io } from "socket.io-client";
const API_BASE_URL =import.meta.env.VITE_APP_BASE_URL;

const socket = io(API_BASE_URL); // Backend port

export default socket;
