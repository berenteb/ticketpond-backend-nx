export enum OrderPatterns {
  GET_ORDER = 'getOrder',
  LIST_ORDERS = 'listOrders',
  LIST_ORDERS_FOR_CUSTOMER = 'listOrdersForCustomer',
  GET_ORDER_FOR_CUSTOMER = 'getOrderForCustomer',
  DELETE_ORDER = 'deleteOrder',
  CREATE_ORDER = 'createOrder',
  GET_ORDER_WITH_CUSTOMER = 'getOrderWithCustomer',
  GET_ORDER_WITH_CUSTOMER_FOR_MERCHANT = 'getOrderWithCustomerForMerchant',
  LIST_ORDERS_FOR_MERCHANT = 'listOrdersForMerchant',
  FULFILL_ORDER = 'fulfillOrder',
  FAIL_ORDER = 'failOrder',
  CANCEL_ORDER = 'cancelOrder',
}
