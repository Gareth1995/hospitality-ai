import { createClient } from "redis";

const redisClient = createClient({
  socket: { host: "127.0.0.1", port: 6379 }, // Update if necessary
});

redisClient.on("error", (err) => console.error("Redis Error:", err));

(async () => {
  if (!redisClient.isOpen) {
    await redisClient.connect();
    console.log("Connected to Redis");
  }
})();

export default redisClient;
