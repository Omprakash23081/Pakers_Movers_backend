import express from 'express';
import { createShipment, trackShipment, updateShipmentStatus, getShipments, deleteShipment } from '../controllers/shipmentController';
import { protect } from '../middleware/authMiddleware';

const router = express.Router();

router.route('/')
  .post(protect, createShipment)
  .get(protect, getShipments);

router.route('/track/:id')
  .get(trackShipment); // Public

router.route('/:id')
  .put(protect, updateShipmentStatus)
  .delete(protect, deleteShipment);

export default router;
