"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const quoteController_1 = require("../controllers/quoteController");
const authMiddleware_1 = require("../middleware/authMiddleware");
const router = express_1.default.Router();
router.route('/')
    .post(quoteController_1.createQuoteRequest)
    .get(authMiddleware_1.protect, quoteController_1.getQuoteRequests);
router.get('/converted', authMiddleware_1.protect, quoteController_1.getConvertedQuotes);
router.route('/:id')
    .put(authMiddleware_1.protect, quoteController_1.updateQuoteStatus)
    .delete(authMiddleware_1.protect, quoteController_1.deleteQuoteRequest);
exports.default = router;
