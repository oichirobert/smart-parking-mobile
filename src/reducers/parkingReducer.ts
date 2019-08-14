import { 
  START_PARKING_PENDING,
  START_PARKING_SUCCESS,
  START_PARKING_FAILURE,
  FINISH_PARKING_PENDING,
  FINISH_PARKING_SUCCESS,
  FINISH_PARKING_FAILURE
} from '../actions';

const initialState = {
  history: [],
  activeTicket: null,
  loadingStartParking: false,
  loadingFinishParking: false
}

export default (state = initialState, action) => {
  switch (action.type) {
    case START_PARKING_PENDING:
      return {
        ...state,
        loadingStartParking: true
      }

    case START_PARKING_SUCCESS:
      return {
        ...state,
        activeTicket: action.invoice,
        loadingStartParking: false
      }

    case START_PARKING_FAILURE:
      return {
        ...state,
        loadingStartParking: false
      }

    case FINISH_PARKING_PENDING:
      return {
        ...state,
        loadingFinishParking: true
      }

    case FINISH_PARKING_SUCCESS:
      return {
        ...state,
        loadingFinishParking: false,
        activeTicket: null
      }

    default:
      return state;
  }
}
