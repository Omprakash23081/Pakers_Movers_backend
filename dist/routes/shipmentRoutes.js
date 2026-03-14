"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const shipmentController_1 = require("../controllers/shipmentController");
const authMiddleware_1 = require("../middleware/authMiddleware");
const router = express_1.default.Router();
router.route('/')
    .post(authMiddleware_1.protect, shipmentController_1.createShipment)
    .get(authMiddleware_1.protect, shipmentController_1.getShipments);
router.route('/track/:id')
    .get(shipmentController_1.trackShipment); // Public
router.route('/:id')
    .put(authMiddleware_1.protect, shipmentController_1.updateShipmentStatus)
    .delete(authMiddleware_1.protect, shipmentController_1.deleteShipment);
exports.default = router;
