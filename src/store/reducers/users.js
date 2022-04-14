const initialState = {
  user: null,
  users: [],
  error: '',
  loading: false,
  usersLoading: false,
  getUserLoading: false,
  loginError: null,
  dashboardStatsError: '',
  accessToken: null,
  registerError: null,
  getStoreLoading: false,
};

export default (state = initialState, action) => {
  switch (action.type) {
    case 'REGISTER_PENDING':
      return {...state, loading: action.loading};
    case 'REGISTER_SUCCESS':
      return {
        ...state,
        loading: action.loading,
        registerError: null,
        user: action.user,
        accessToken: action.accessToken,
      };
    case 'REGISTER_FAILED':
      return {...state, loading: action.loading, registerError: action.error};

    case 'LOGIN_USER':
      return {
        ...state,
        profile: action.profile,
        accessToken: action.accessToken,
      };
    case 'LOGIN_PENDING':
      return {...state, loading: action.loading};
    case 'LOGIN_SUCCESS':
      return {
        ...state,
        user: action.user,
        loading: action.loading,
        accessToken: action.accessToken,
        loginError: null,
      };
    case 'LOGIN_FAILED':
      return {...state, loading: action.loading, loginError: action.error};

    case 'FETCH_ALL_USERS_PENDING':
      return {...state, usersLoading: action.loading};
    case 'FETCH_ALL_USERS_SUCCESS':
      return {
        ...state,
        users: action.users,
        usersLoading: action.loading,
        error: null,
      };
    case 'FETCH_ALL_USERS_FAILED':
      return {
        ...state,
        usersLoading: action.loading,
        error: action.error,
      };

    case 'GET_USER_PENDING':
      return {...state, getUserLoading: action.loading};
    case 'GET_USER_SUCCESS':
      return {
        ...state,
        user: action.user,
        getUserLoading: action.loading,
        error: null,
      };
    case 'GET_USER_FAILED':
      return {...state, getUserLoading: action.loading, error: action.error};

    case 'CLEAR_STATS_ARRAY':
      return initialState;

    case 'LOGOUT_USER':
      return {
        ...state,
        user: action.user,
        isStoreSetup: false,
        profile: null,
        accessToken: null,
      };
    default:
      return state;
  }
};
