const initialState = {
  user: null,
  business: null,
  users: [],
  storeLocations: {},
  error: '',
  loading: false,
  usersLoading: false,
  getUserLoading: false,
  createUserLoading: false,
  patchUserLoading: false,
  deleteUserLoading: false,
  hasPatchedUser: false,
  hasRequestedReset: false,
  hasResetPassword: false,

  loginError: null,
  dashboardStatsError: '',

  requestPasswordResetError: false,
  hasCreatedUser: false,
  hasDeletedUser: false,
  accessToken: null,
  registerError: null,
  getStoreLoading: false,
  getLocationLoading: false,
  getUrlLoading: false,
  isStoreSetup: true,
  isAddProductDone: false,
  profile: [],
  uploadFileLoading: false,

  storeSetupData: {},

  store: undefined,
  storeAndWallet: undefined,

  storeUrlStatus: '',
  updateLocationLoading: false,
  patchStoreLoading: false,
  patchLocationLoading: false,
  hasUploadedFile: false,
  hasPatchedLocation: false,
  dashboardStats: null,
  dashboardStatsLoading: true,
  dashboardStatsError: false,
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
      return {...state, hasCreatedUser: false, usersLoading: action.loading};
    case 'FETCH_ALL_USERS_SUCCESS':
      return {
        ...state,
        hasCreatedUser: false,
        hasDeletedUser: false,
        users: action.users,
        meta: {...state.meta, ...action.meta},
        usersLoading: action.loading,
        error: null,
      };
    case 'FETCH_ALL_USERS_FAILED':
      return {
        ...state,
        hasCreatedUser: false,
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

    case 'CREATE_USER_PENDING':
      return {...state, createUserLoading: action.loading};
    case 'CREATE_USER_SUCCESS':
      return {
        ...state,
        hasCreatedUser: true,
        createUserLoading: action.loading,
        error: null,
      };
    case 'CREATE_USER_FAILED':
      return {
        ...state,
        createUserLoading: action.loading,
        error: action.error,
      };

    case 'PATCH_USER_PENDING':
      return {...state, patchUserLoading: action.loading};
    case 'PATCH_USER_SUCCESS':
      return {
        ...state,
        hasPatchedUser: true,
        patchUserLoading: action.loading,
        error: null,
      };
    case 'PATCH_USER_FAILED':
      return {
        ...state,
        patchUserLoading: action.loading,
        error: action.error,
      };

    case 'DELETE_USER_PENDING':
      return {...state, deleteUserLoading: action.loading};
    case 'DELETE_USER_SUCCESS':
      return {
        ...state,
        deleteUserLoading: action.loading,
        hasDeletedUser: true,
        error: null,
      };
    case 'DELETE_USER_FAILED':
      return {
        ...state,
        deleteUserLoading: action.loading,
        error: action.error,
      };

    case 'REQUEST_PASSWORD_RESET_PENDING':
      return {...state, loading: action.loading};
    case 'REQUEST_PASSWORD_RESET_SUCCESS':
      return {
        ...state,
        hasRequestedReset: true,
        loading: action.loading,
        requestPasswordResetError: null,
      };
    case 'REQUEST_PASSWORD_RESET_FAILED':
      return {
        ...state,
        loading: action.loading,
        requestPasswordResetError: action.error,
      };

    case 'REQUEST_PASSWORD_UPDATE_PENDING':
      return {...state, loading: action.loading};
    case 'REQUEST_PASSWORD_UPDATE_SUCCESS':
      return {
        ...state,
        loading: action.loading,
        requestPasswordResetError: null,
      };
    case 'REQUEST_PASSWORD_UPDATE_FAILED':
      return {
        ...state,
        loading: action.loading,
        requestPasswordResetError: action.error,
      };

    case 'COMPLETE_PASSWORD_RESET_PENDING':
      return {...state, loading: action.loading};
    case 'COMPLETE_PASSWORD_RESET_SUCCESS':
      return {
        ...state,
        hasResetPassword: true,
        loading: action.loading,
        error: null,
      };
    case 'COMPLETE_PASSWORD_RESET_FAILED':
      return {...state, loading: action.loading, error: action.error};

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
