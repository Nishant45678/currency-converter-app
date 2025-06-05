import { Router } from "express";
import {isAuthenticated} from "../middleware/index.js";
import { deleteFavourite, getFavourites, postFavourite } from "../controller/favourites.controller.js";

const router = Router();

router.get("/",isAuthenticated, getFavourites );

router.post("/",isAuthenticated, postFavourite);

router.delete("/:id",isAuthenticated,deleteFavourite);

export { router as favouriteRouter };
