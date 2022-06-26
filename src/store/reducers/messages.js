const initialState = {
  messageArray: [],
  messagesLoading: false,
  updateMessagesLoading: false,
  error: '',
};

export default (state = initialState, action) => {
  switch (action.type) {
    case 'GET_MESSAGES_PENDING':
      return {
        ...state,
        messagesLoading: action.loading,
      };
    case 'GET_MESSAGES_SUCCESS':
      return {
        ...state,
        messageArray: action.data,
        messagesLoading: action.loading,
      };
    case 'GET_MESSAGES_FAILED':
      return {
        ...state,
        messagesLoading: action.loading,
        error: action.error,
      };

      case 'UPDATE_MESSAGE_PENDING':
      return {
        ...state,
        updateMessagesLoading: action.loading,
      };
    case 'UPDATE_MESSAGE_SUCCESS':
      return {
        ...state,
        messageArray: action.data,
        updateMessagesLoading: action.loading,
      };
    case 'UPDATE_MESSAGE_FAILED':
      return {
        ...state,
        updateMessagesLoading: action.loading,
        error: action.error,
      };

    default:
      return state;
  }
};
