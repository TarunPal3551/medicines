const express= require('express');
const router= express.Router();
const orderControllers=require('../controllers/orders');
const checkAuth=require('../middleware/check-auth');
router.get('/',checkAuth,orderControllers.orders_get_all);
router.post('/',checkAuth,orderControllers.createOrders);
router.get("/:orderId",checkAuth,orderControllers.getOrdersById);
router.patch('/:orderId',checkAuth,orderControllers.updateOrders);
router.delete('/:orderId',checkAuth,orderControllers.deleteOrders);
module.exports=router;