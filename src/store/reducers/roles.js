const initialState = {
  roles: [],
  role: {},
  rolesLoading: false,
  error: '',
};

export default (state = initialState, action) => {
  switch (action.type) {
    case 'GET_SINGLE_ROLE_PENDING':
      return {
        ...state,
        rolesLoading: action.loading,
      };
    case 'GET_SINGLE_ROLE_SUCCESS':
      return {
        ...state,
        role: action.data,
        rolesLoading: action.loading,
      };
    case 'GET_SINGLE_ROLE_FAILED':
      return {
        ...state,
        rolesLoading: action.loading,
        error: action.error,
      };

    case 'GET_ALL_ROLES_PENDING':
      return {
        ...state,
        rolesLoading: action.loading,
      };
    case 'GET_ALL_ROLES_SUCCESS':
      return {
        ...state,
        roles: action.data,
        rolesLoading: action.loading,
      };
    case 'GET_ALL_ROLES_FAILED':
      return {
        ...state,
        rolesLoading: action.loading,
        error: action.error,
      };

    default:
      return state;
  }
};
