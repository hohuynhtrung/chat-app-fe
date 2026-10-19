import Pusher from "pusher-js";

const key = import.meta.env.VITE_PUSHER_KEY;
const cluster = import.meta.env.VITE_PUSHER_CLUSTER;

if (!key) {
  console.error("Thiếu VITE_PUSHER_KEY trong file .env của FE");
}

const pusher = new Pusher(key, { cluster });

export default pusher;
