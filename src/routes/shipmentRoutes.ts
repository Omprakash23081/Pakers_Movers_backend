import express from 'express';
import { createShipment, trackShipment, updateShipmentStatus, getShipments, deleteShipment, getWhatsAppStatus, sendWhatsAppMessage, getQRCode } from '../controllers/shipmentController';
import { protect } from '../middleware/authMiddleware';

const router = express.Router();

router.get('/whatsapp/status', protect, getWhatsAppStatus);

router.get('/qr', getQRCode); // Public/Manual scan page

router.route('/')
  .post(protect, createShipment)
  .get(protect, getShipments);

router.post('/send-whatsapp', protect, sendWhatsAppMessage);

router.route('/track/:id')
  .get(trackShipment); // Public

router.route('/:id')
  .put(protect, updateShipmentStatus)
  .delete(protect, deleteShipment);

export default router;
