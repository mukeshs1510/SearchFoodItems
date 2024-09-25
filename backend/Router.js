import express from "express";
import DataController from "./controllers/food.controller.js";

const router = express.Router();

// to get the food data
router.get("/food/items", DataController.getData);
router.get("/food/search", DataController.getDataBySearch);

export default router;
