import Fastify from "fastify";
import cors from "@fastify/cors";

const app = Fastify({
  logger: true,
});

async function start() {
  await app.register(cors, {
    origin: true,
  });

  app.get("/health", async () => {
    return {
      status: "ok",
      service: "switch-ai-gateway",
      timestamp: new Date().toISOString(),
    };
  });

  app.get("/v1/models", async () => {
    return {
      object: "list",
      data: [],
    };
  });

  const port = Number(process.env.PORT ?? 8787);
  const host = process.env.HOST ?? "127.0.0.1";

  try {
    await app.listen({
      port,
      host,
    });

    console.log(
      `SwitchAI Gateway running at http://${host}:${port}`,
    );
  } catch (error) {
    app.log.error(error);
    process.exit(1);
  }
}

start();