import { Router } from "express";
import { isAuthenticated } from "../middleware/index.js";
import { getAlerts, postAlerts } from "../controller/notification.controller.js";


const router = Router();

router.get("/",isAuthenticated,getAlerts);

router.post("/", isAuthenticated, postAlerts);

export { router as notificationRouter };
