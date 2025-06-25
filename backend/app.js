import express from "express";
import passport from "passport";
import session from "express-session";
import cors from "cors";
import MongoStore from "connect-mongo";
import path from "path";
import "./config/passport.js";
import {
  userRoute,
  currencyRouter,
  historyRouter,
  favouriteRouter,
  notificationRouter,
} from "./routes/index.js";
import errorHandler from "./middleware/errorHandler.middleware.js";

const app = express();
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  session({
    secret: process.env.SECRET.trim(),
    saveUninitialized: false,
    resave: false,
    store: MongoStore.create({
      mongoUrl: process.env.MONGO_URI,
      ttl: 24 * 60 * 60,
      autoRemove: "native",
    }),
    cookie: {
      httpOnly: true,
      secure: process.env.NODE_ENV.trim() === "production",
      maxAge: 24 * 60 * 60 * 1000,
    },
  })
);

app.use(passport.initialize());
app.use(passport.session());

// app.get("/", (req, res) => {
  //   return res.status(200).json({ message: "hello world" });
  // });
app.use(express.static(path.join(__dirname, "../frontend/dist")));

app.use("/api/", userRoute);
app.use("/api/", currencyRouter);
app.use("/api/historical", historyRouter);
app.use("/api/favorites", favouriteRouter);
app.use("/api/alerts", notificationRouter);

app.get("/", (req, res) => {
    return res.sendFile(path.join(__dirname, "../frontend/dist/index.html"));
});

import "./config/cron.js";

app.use(errorHandler);

export default app;
