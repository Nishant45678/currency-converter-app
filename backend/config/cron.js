import nodeCron from "node-cron";
import { Alert } from "../models/index.js";
import sendEmail from "../utils/sendEmail.util.js";

if (process.env.NODE_ENV === "production")
  nodeCron.schedule("0 8 * * *", async () => {
    try {
      const alerts = await Alert.find().populate("userId");
      for (const alert of alerts) {
        const {
          from,
          to,
          condition,
          threshold,
          hasDelivered,
          wantDailyUpdates,
        } = alert;
        const { email } = alert.userId;
        const response = await fetch(
          `https://api.frankfurter.dev/v1/latest?base=${from}&symbols=${to}`
        );
        const data = await response.json();
        const rate = data.rates[to];
        let isTriggered = false;
        if (!hasDelivered) {
          switch (condition) {
            case "<":
              isTriggered = rate < threshold;
              break;
            case ">":
              isTriggered = rate > threshold;
              break;
            case "=":
              isTriggered = rate === threshold;
              break;
          }
        }
        if (isTriggered) {
          sendEmail(email, from, to, rate, condition, threshold);
          alert.hasDelivered = true;
          await alert.save();
        }
        if (wantDailyUpdates) {
          sendEmail(email, from, to, rate);
        }
      }
    } catch (error) {
      console.log(error);
    }
  });
