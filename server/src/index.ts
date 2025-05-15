import express from "express";
import cors from "cors";
import userController from "./controllers/userController";
import productController from "./controllers/productController";
import authController from "./controllers/authController";
import { requireAuth } from "./middleware/requireAuth";

const app = express();
app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }));
app.use(express.json());

app.use((req, res, next) => {
  const { method, originalUrl } = req;
  const timestamp = new Date().toISOString();
  const userAgent = req.headers["user-agent"] || "unknown";
  console.log(`${method} - ${originalUrl} - ${timestamp} - UA: ${userAgent}`);
  next();
});

app.use("/users", requireAuth, userController);
app.use("/products", requireAuth, productController);
app.use("/auth", authController);

const port = process.env.PORT;

const isPortInUse = (err: unknown): boolean => {
  return (
    typeof err === "object" &&
    err !== null &&
    "code" in err &&
    (err as { code?: string }).code === "EADDRINUSE"
  );
};

const startServer = (port: string | undefined) => {
  const server = app.listen(port, () => {
    console.log("🚀 Server running on port " + port);
  });
  server.on("error", (err: unknown) => {
    if (isPortInUse(err)) {
      console.log(`Port ${port} in use`);
      throw err;
    }
  });
};

startServer(port);
