const initialState = {
  dispatchAnalytics: [],
  dispatchLoading: false,
  error: '',
};

export default (state = initialState, action) => {
  switch (action.type) {
    case 'GET_RIDER_ANALYTICS_PENDING':
      return {
        ...state,
        dispatchLoading: action.loading,
      };
    case 'GET_RIDER_ANALYTICS_SUCCESS':
      return {
        ...state,
        dispatchAnalytics: action.data,
        dispatchLoading: action.loading,
      };
    case 'GET_RIDER_ANALYTICS_FAILED':
      return {
        ...state,
        dispatchLoading: action.loading,
        error: action.error,
      };

    default:
      return state;
  }
};
