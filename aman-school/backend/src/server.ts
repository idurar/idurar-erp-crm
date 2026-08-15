import express from "express";
import cors from "cors";
import { createServer } from "http";
import { env } from "./env";
import { errorHandler } from "./lib/errors";
import { prisma } from "./prisma";
import { healthRouter } from "./routes/health.routes";
import { authRouter } from "./routes/auth.routes";
import { studentsRouter } from "./routes/students.routes";
import { tripsRouter } from "./routes/trips.routes";
import { supervisorRouter } from "./routes/supervisor.routes";
import { busesRouter } from "./routes/buses.routes";
import { emergencyRouter } from "./routes/emergency.routes";
import { parentsRouter } from "./routes/parents.routes";
import { notificationsRouter } from "./routes/notifications.routes";
import { schoolsRouter } from "./routes/schools.routes";
import { operationsRouter } from "./routes/operations.routes";
import { ownerRouter } from "./routes/owner.routes";
import { partnerRouter } from "./routes/partner.routes";
import { subscriptionsRouter } from "./routes/subscriptions.routes";
import { sysadminRouter } from "./routes/sysadmin.routes";
import { regulatorRouter } from "./routes/regulator.routes";
import { consentRouter } from "./routes/consent.routes";
import { initSocketGateway } from "./sockets/gateway";
import { startGpsSimulator } from "./sockets/simulator";

const app = express();
app.use(cors({ origin: env.corsOrigin === "*" ? true : env.corsOrigin.split(","), credentials: true }));
app.use(express.json());

/** Real (not simulated) rolling request log for the System Administrator's
 * sa-logs screen. Fire-and-forget so a logging failure never affects the
 * response; capped by not awaiting and by sa-logs only reading the latest 200. */
app.use((req, res, next) => {
  const start = Date.now();
  res.on("finish", () => {
    const durationMs = Date.now() - start;
    const level = res.statusCode >= 500 ? "error" : res.statusCode >= 400 ? "warn" : "info";
    prisma.requestLog
      .create({ data: { method: req.method, path: req.path, statusCode: res.statusCode, durationMs, level } })
      .catch(() => {});
  });
  next();
});

app.use(healthRouter);
app.use(authRouter);
app.use(consentRouter);
app.use(studentsRouter);
app.use(tripsRouter);
app.use(supervisorRouter);
app.use(busesRouter);
app.use(emergencyRouter);
app.use(parentsRouter);
app.use(notificationsRouter);
app.use(schoolsRouter);
// regulatorRouter must be mounted before any router with a blanket, narrow
// requireRole(...) (operations/owner/sysadmin below) — those apply their role
// check to every request that reaches them regardless of path, so a role
// they don't list (like "regulator") gets rejected before Express ever tries
// a later router's routes.
app.use(regulatorRouter);
app.use(operationsRouter);
app.use(ownerRouter);
app.use(partnerRouter);
app.use(subscriptionsRouter);
app.use(sysadminRouter);

app.use((_req, res) => res.status(404).json({ error: "Not found" }));
app.use(errorHandler);

const httpServer = createServer(app);
initSocketGateway(httpServer);
startGpsSimulator();

httpServer.listen(env.port, () => {
  console.log(`Aman School backend listening on :${env.port} (${env.nodeEnv})`);
});
