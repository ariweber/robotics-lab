import express from "express";
import usersRouter from "./routes/users.router.js";
import sessionsRouter from "./routes/sessions.router.js";

const app = express();

app.use(express.json());

app.use("/users", usersRouter);
app.use("/sessions", sessionsRouter);

app.use((err, req, res, next) => {
  const body = { error: err.message };                  
  if (err.remainingSpots !== undefined)
    body.remainingSpots = err.remainingSpots;          
  res.status(err.status || 500).json(body);            
});

export default app;
