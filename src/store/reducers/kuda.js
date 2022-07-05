const initialState = {
  kudaArray: [],
  kudaLoading: false,
  error: '',
};

export default (state = initialState, action) => {
  switch (action.type) {
    case 'GET_KUDA_HISTORY_PENDING':
      return {
        ...state,
        kudaLoading: action.loading,
      };
    case 'GET_KUDA_HISTORY_SUCCESS':
      return {
        ...state,
        kudaArray: action.data,
        kudaLoading: action.loading,
      };
    case 'GET_KUDA_HISTORY_FAILED':
      return {
        ...state,
        kudaLoading: action.loading,
        error: action.error,
      };

    default:
      return state;
  }
};
