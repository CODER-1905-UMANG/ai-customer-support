import Payment from "../models/Payment.js";
import Order from "../models/Order.js";

const checkPaymentStatus = async (orderId) => {
  try {
    if (!orderId) {
      return {
        success: false,
        error: "Order ID is required.",
      };
    }

    const order = await Order.findOne({ orderId });

    if (!order) {
      return {
        success: false,
        error: `Order ${orderId} was not found.`,
      };
    }

    const payment = await Payment.findOne({
      orderId: order._id,
    });

    if (!payment) {
      return {
        success: false,
        error: `No payment record found for order ${orderId}.`,
      };
    }

    return {
      success: true,
      data: {
        orderId,
        paymentId: payment.paymentId,
        amount: payment.amount,
        status: payment.status,
        paymentMethod: payment.paymentMethod,
        transactionId: payment.transactionId,
        paidAt: payment.paidAt,
      },
    };
  } catch (error) {
    console.error("checkPaymentStatus error:", error.message);

    return {
      success: false,
      error: "Unable to check payment status at the moment.",
    };
  }
};

export default checkPaymentStatus;