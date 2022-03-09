const initialState = {
  notes: [],
  note: {},
  getNotesLoading: false,
  createNoteLoading: false,
  updateNoteLoading: false,
  isNoteUpdated: false,
  deleteNoteLoading: false,
  hasDeletedNote: false,
  error: '',
};

export default (state = initialState, action) => {
  switch (action.type) {
    case 'CLEAR_NOTES_STATE':
      return {
        ...state,
        notes: [],
      };

    case 'CREATE_NOTE_PENDING':
      return {
        ...state,
        createNoteLoading: action.loading,
      };
    case 'CREATE_NOTE_SUCCESS':
      return {
        ...state,
        notes: action.data,
        createNoteLoading: action.loading,
      };
    case 'CREATE_NOTE_FAILED':
      return {
        ...state,
        createNoteLoading: action.loading,
        error: action.error,
      };

    case 'GET_SINGLE_NOTE_PENDING':
      return {
        ...state,
        getNotesLoading: action.loading,
      };
    case 'GET_SINGLE_NOTE_SUCCESS':
      return {
        ...state,
        note: action.data,
        getNotesLoading: action.loading,
      };
    case 'GET_SINGLE_NOTE_FAILED':
      return {
        ...state,
        getNotesLoading: action.loading,
        error: action.error,
      };

    case 'DELETE_SINGLE_NOTE_PENDING':
      return {
        ...state,
        deleteNoteLoading: action.loading,
      };
    case 'DELETE_SINGLE_NOTE_SUCCESS':
      return {
        ...state,
        hasDeletedNote: true,
        deleteNoteLoading: action.loading,
      };
    case 'DELETE_SINGLE_NOTE_FAILED':
      return {
        ...state,
        deleteNoteLoading: action.loading,
        error: action.error,
      };

    case 'GET_ALL_NOTES_PENDING':
      return {
        ...state,
        getNotesLoading: action.loading,
      };
    case 'GET_ALL_NOTES_SUCCESS':
      return {
        ...state,
        notes: action.data,
        getNotesLoading: action.loading,
      };
    case 'GET_ALL_NOTES_FAILED':
      return {
        ...state,
        getNotesLoading: action.loading,
        error: action.error,
      };

    case 'UPDATE_NOTES_PENDING':
      return {
        ...state,
        updateNoteLoading: action.loading,
        isNoteUpdated: false,
      };
    case 'UPDATE_NOTES_SUCCESS':
      return {
        ...state,
        isNoteUpdated: true,
        updateNoteLoading: action.loading,
      };
    case 'UPDATE_NOTES_FAILED':
      return {
        ...state,
        isNoteUpdated: false,
        updateNoteLoading: action.loading,
        error: action.error,
      };

    default:
      return state;
  }
};
