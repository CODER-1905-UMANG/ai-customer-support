import Order from "../models/Order.js";
import Customer from "../models/Customer.js";

const checkOrderStatus = async (orderId) => {
  try {


    if (!orderId) {
      return {
        success: false,
        error: "Order ID is required.",
      };
    }

    const order = await Order.findOne({ orderId }).populate(
      "customerId",
      "name email"
    );

    if (!order) {
      return {
        success: false,
        error: `Order ${orderId} was not found.`,
      };
    }

    return {
      success: true,
      data: {
        orderId: order.orderId,
        customer: order.customerId?.name,
        product: order.product,
        amount: order.amount,
        status: order.status,
        estimatedDelivery: order.estimatedDelivery,
        deliveryAddress: order.deliveryAddress,
      },
    };
  } catch (error) {
    console.error("checkOrderStatus error:", error.message);

    return {
      success: false,
      error: "Unable to check order status at the moment.",
    };
  }
};

export default checkOrderStatus;