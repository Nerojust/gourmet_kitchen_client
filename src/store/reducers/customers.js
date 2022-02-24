const initialState = {
  customer: null,
  error: null,
  loading: false,
  createCustomerLoading: false,
  hasCreatedCustomer: false,
};

export default (state = initialState, action) => {
  switch (action.type) {
    case 'CREATE_CUSTOMER_PENDING':
      return {...state, createCustomerLoading: action.loading};
    case 'CREATE_CUSTOMER_SUCCESS':
      return {
        ...state,
        customer: action.customer,
        hasCreatedCustomer: true,
        createCustomerLoading: action.loading,
      };
    case 'CREATE_CUSTOMER_FAILED':
      return {
        ...state,
        createCustomerLoading: action.loading,
        error: action.error,
      };

    default:
      return state;
  }
};
