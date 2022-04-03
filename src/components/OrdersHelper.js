const OrdersHelper = {
  resolveAmount: (order) => {
    if (order) {
      const orderTotal = order?.products?.reduce((acc, order_item) => {
        acc += (order_item?.price || 0) * order_item?.quantity;
        return acc;
      }, 0);
   

      const deliveryAmount = order?.delivery
        ? order?.delivery[0]?.price
        : 0;
  
  
      //console.log("final discount amount is ", discountAmount);
      const grandTotalAmount =
        orderTotal + deliveryAmount;
    
      return {
        grandTotalAmount,
        deliveryAmount,
        orderTotal
      };
    } else {
      return {
        grandTotalAmount: 0,
        deliveryAmount: 0,
        orderTotal: 0
      };
    }
  }
};

export default OrdersHelper;
