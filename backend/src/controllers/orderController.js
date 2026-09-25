import Order from "../models/Order.js";

const getOrderById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id || !id.trim()) {
      return res.status(400).json({
        success: false,
        error: "Order ID is required.",
      });
    }

    const order = await Order.findOne({ orderId: id }).populate(
      "customerId",
      "name email phone"
    );

    if (!order) {
      return res.status(404).json({
        success: false,
        error: `Order ${id} not found.`,
      });
    }

    return res.status(200).json({
      success: true,
      data: {
        orderId: order.orderId,
        customer: order.customerId
          ? {
              name: order.customerId.name,
              email: order.customerId.email,
              phone: order.customerId.phone,
            }
          : null,
        product: order.product,
        amount: order.amount,
        status: order.status,
        estimatedDelivery: order.estimatedDelivery,
        deliveryAddress: order.deliveryAddress,
      },
    });
  } catch (error) {
    console.error("Get order error:", error.message);

    return res.status(500).json({
      success: false,
      error: "Unable to retrieve order.",
    });
  }
};

export default getOrderById;