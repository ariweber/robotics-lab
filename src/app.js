import express from "express";
import usersRouter from "./routes/users.router.js";
import sessionsRouter from "./routes/sessions.router.js";

const app = express();

app.use(express.json());

app.use("/users", usersRouter);
app.use("/sessions", sessionsRouter);

app.use((err, req, res, next) => {
  res.status(err.status || 500).json({ error: err.message });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`server running on port ${PORT}...`);
});
