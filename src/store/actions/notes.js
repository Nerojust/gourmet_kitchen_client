import client from '../../utils/Api';
import {dateFilterParser} from '../../utils/DateFilter';
import {clearStorage, handleError} from '../../utils/utils';
import {getOrder} from './orders';

export const getAllNotes = () => {
  console.log('About to get all notes');
  return dispatch => {
    dispatch({
      type: 'GET_ALL_NOTES_PENDING',
      loading: true,
      error: null,
    });
    var getUrl = `/notes`;
    console.log('geturl notes', getUrl);
    return client
      .get(getUrl)
      .then(response => {
        if (response?.data) {
          console.log('Notes gotten successfully', response?.data?.recordCount);
          if (response?.data?.isSuccessful) {
            dispatch({
              type: 'GET_ALL_NOTES_SUCCESS',
              loading: false,
              data: response?.data?.results,
            });
            return response?.data?.results;
          } else {
            dispatch({
              type: 'GET_ALL_NOTES_FAILED',
              loading: false,
              error: response?.data?.message,
            });
          }
        }
      })
      .catch(error => {
        console.log('Getting notes failed', error);
        handleError(error, dispatch, 'get notes list');
        dispatch({
          type: 'GET_ALL_NOTES_FAILED',
          loading: false,
          error: error.message,
        });
      });
  };
};

export const createNote = notePayload => {
  console.log('About to create a new note');
  //console.log("order payload", notePayload);
  return dispatch => {
    dispatch({
      type: 'CREATE_NOTE_PENDING',
      loading: true,
      error: null,
    });

    return client
      .post(`/notes`, notePayload)
      .then(response => {
        if (response.data?.isSuccessful) {
          console.log('note created successfully');

          dispatch({
            type: 'CREATE_NOTE_SUCCESS',
            loading: false,
          });

          //dispatch(getAllNotes());
          getOrder(notePayload?.orderid);
          return response.data?.results;
        } else {
          dispatch({
            type: 'CREATE_NOTE_FAILED',
            loading: false,
            error: error.message,
          });
        }
      })
      .catch(error => {
        console.log('Error creating note ', error);
        handleError(error, dispatch, 'get note list');
        dispatch({
          type: 'CREATE_NOTE_FAILED',
          loading: false,
          error: error.message,
        });
      });
  };
};

export const getNoteById = id => {
  console.log('About to get single note with id', id);
  return dispatch => {
    dispatch({
      type: 'GET_SINGLE_NOTE_PENDING',
      loading: true,
      error: null,
    });
    return client
      .get(`/notes/${id}`)
      .then(response => {
        if (response.data) {
          console.log('Single set gotten successfully');
          dispatch({
            type: 'GET_SINGLE_NOTE_SUCCESS',
            loading: false,
            data: response.data,
          });
          return response.data;
        }
      })

      .catch(error => {
        console.log('Error getting single note', error);
        handleError(error, dispatch, 'get note');
        dispatch({
          type: 'GET_SINGLE_NOTE_FAILED',
          loading: false,
          error: error.message,
        });
      });
  };
};

export const deleteNoteById = id => {
  console.log('About to delete note with id ' + id);

  return dispatch => {
    dispatch({
      type: 'DELETE_SINGLE_NOTE_PENDING',
      loading: true,
      error: null,
    });

    return client
      .delete(`/notes/${id}`)
      .then(response => {
        if (response.data) {
          if (response?.data?.isSuccessful) {
            console.log('Deleted single note successfully', id, response.data);
            alert('Deleted single note successfully');
            dispatch(getAllNotes(''));
            dispatch({
              type: 'DELETE_SINGLE_NOTE_SUCCESS',
              loading: false,
              //data: response.data,
            });

            return response.data;
          }
        }
      })

      .catch(error => {
        console.log('Error deleting single note', error);
        handleError(error, dispatch, 'deleting note');
        dispatch({
          type: 'DELETE_SINGLE_NOTE_FAILED',
          loading: false,
          error: error.message,
        });
      });
  };
};
