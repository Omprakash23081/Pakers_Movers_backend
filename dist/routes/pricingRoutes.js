"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const pricingController_1 = require("../controllers/pricingController");
const authMiddleware_1 = require("../middleware/authMiddleware");
const router = express_1.default.Router();
// Public routes
router.get('/', pricingController_1.getAllPricing);
router.get('/:category', pricingController_1.getPricingByCategory);
// Protected routes (Admin only)
router.put('/:category', authMiddleware_1.protect, pricingController_1.updatePricing);
router.post('/seed', authMiddleware_1.protect, pricingController_1.seedPricing);
exports.default = router;
