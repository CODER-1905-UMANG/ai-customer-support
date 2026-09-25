import Order from "../models/Order.js";
import Payment from "../models/Payment.js";

const getPaymentById = async (req, res) => {

  try {
    const { id } = req.params;

    if (!id || !id.trim()) {
      return res.status(400).json({
        success: false,
        error: "Order ID is required.",
      });
    }

    // First find the order using the business order ID
    const order = await Order.findOne({ orderId: id });

    if (!order) {
      return res.status(404).json({
        success: false,
        error: `Order ${id} not found.`,
      });
    }

    // Then find the payment using the MongoDB Order _id
    const payment = await Payment.findOne({
      orderId: order._id,
    });

    if (!payment) {
      return res.status(404).json({
        success: false,
        error: `Payment for order ${id} not found.`,
      });
    }

    return res.status(200).json({
      success: true,
      data: {
        orderId: id,
        paymentId: payment.paymentId,
        amount: payment.amount,
        status: payment.status,
        paymentMethod: payment.paymentMethod,
        transactionId: payment.transactionId,
        paidAt: payment.paidAt,
      },
    });
  } catch (error) {
    console.error("Get payment error:", error.message);

    return res.status(500).json({
      success: false,
      error: "Unable to retrieve payment information.",
    });
  }
};

export default getPaymentById;