import { app } from "./app";
import { config } from "./config";
import { connectDB } from "./config/db";

async function main() {
  try {
    await connectDB();
    app.listen(config.port, () => {
      console.log(`CartPilot API server listening on http://localhost:${config.port}`);
    });
  } catch (error) {
    console.error("Fatal startup error:", error);
    process.exit(1);
  }
}

main();
