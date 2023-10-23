import express from "express";
import { requireSignIn } from "../middlewares/authMiddleware.js";
import {
  cardPhotoController,
  createBusinessCardController,
  deleteCardController,
  getBusinessCardController,
  getSingleBusinessCardController,
  searchCardController,
  updateBusinessCardController,
} from "../controllers/businessCardController.js";
import formidable from "express-formidable";

const router = express.Router();

//routes
router.post(
  "/create-business-card",
  requireSignIn,
  formidable(),
  createBusinessCardController
);
//update
router.put(
  "/update-business-card/:cid",
  requireSignIn,
  formidable(),
  updateBusinessCardController
);

//get cards
router.get("/get-business-card", getBusinessCardController);

//get single cards
router.get("/get-business-card/:slug", getSingleBusinessCardController);

//get photo
router.get("/card-photo/:cid", cardPhotoController);

//delete card
router.delete("/delete-card/:cid", deleteCardController);

//search route
router.get("/search/:keyword", searchCardController);

export default router;
