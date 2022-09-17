const initialState = {
  configArray: [],
  config: {},
  configLoading: false,
  error: '',
};

export default (state = initialState, action) => {
  switch (action.type) {
    case 'GET_SINGLE_CONFIG_PENDING':
      return {
        ...state,
        configLoading: action.loading,
      };
    case 'GET_SINGLE_CONFIG_SUCCESS':
      return {
        ...state,
        config: action.data,
        configLoading: action.loading,
      };
    case 'GET_SINGLE_CONFIG_FAILED':
      return {
        ...state,
        configLoading: action.loading,
        error: action.error,
      };

    case 'GET_ALL_CONFIG_PENDING':
      return {
        ...state,
        configLoading: action.loading,
      };
    case 'GET_ALL_CONFIG_SUCCESS':
      return {
        ...state,
        configArray: action.data,
        configLoading: action.loading,
      };
    case 'GET_ALL_CONFIG_FAILED':
      return {
        ...state,
        configLoading: action.loading,
        error: action.error,
      };

    default:
      return state;
  }
};
