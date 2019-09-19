import { Auth, API, graphqlOperation } from 'aws-amplify';
import * as mutations from '../graphql/mutations';
import * as queries from '../graphql/queries';
import { 
  ParkingResponse, 
  ActionType,
  Action,
  CreateInvoiceMutationVariables,
  CloseInvoiceMutationVariables ,
  CreateInvoiceResponse,
  CloseInvoiceResponse
} from '../types';

export const selectParking = (parkingId) => {
  return {
    type: ActionType.SELECTED_PARKING,
    parkingId
  }
}

export const startParking = ({ navigation, data  }: { navigation: any, data: CreateInvoiceMutationVariables }) => {
  return async (dispatch, getState) => {
    dispatch({
       type: ActionType.START_PARKING_PENDING 
    });

    const { 
      account: { user }, 
      map: { selectedParkingId } 
    } = getState();
    
    try {  
      const response: CreateInvoiceResponse = await API.graphql(graphqlOperation(mutations.createInvoice, data));
      const { data: { createInvoice: invoice } } = response;

      dispatch({
        type: ActionType.START_PARKING_SUCCESS,
        invoice: {
          parkingID: invoice.parkingID,
          invoiceID: invoice.invoiceID,
          slotNumber: invoice.slotNumber,
          dateFrom: invoice.dateFrom,
          dateTo: invoice.dateTo,
          plateNumber: invoice.plateNumber,
          price: invoice.price
        }
      } as Action);

      navigation.popToTop();
      navigation.navigate('ParkingHome');
    } catch(error) {
      dispatch({ type: ActionType.START_PARKING_FAILURE, error });
    }
  }
}

export const finishParking = () => {
  return async (dispatch, getState) => {
    dispatch({
       type: ActionType.FINISH_PARKING_PENDING 
    });

    const { parking: { activeTicket } } = getState();
    
    try {
      const data: CloseInvoiceMutationVariables = {
        input: {
          parkingID: activeTicket.parkingID,
          invoiceID: activeTicket.invoiceID
        }
      };
      
      await API.graphql(graphqlOperation(mutations.closeInvoice, data));

      dispatch({ type: ActionType.FINISH_PARKING_SUCCESS });
    } catch(error) {
      dispatch({ type: ActionType.FINISH_PARKING_FAILURE, error });
    }
  }
}

export const fetchUser = () => {
  return async (dispatch, getState) => {
    dispatch({
       type: ActionType.FETCH_USER_PENDING 
    });
    
    try {
      const cognitoUser = await Auth.currentAuthenticatedUser();
      dispatch({ type: ActionType.FETCH_USER_SUCCESS, user: {
        id: cognitoUser.attributes.sub,
        email: cognitoUser.attributes.email,
        phone: cognitoUser.attributes.phone_number
      } });
    } catch(error) {
      dispatch({ type: ActionType.FETCH_USER_FAILURE, error });
    }
  }
}

export const fetchParkingList = () => async (dispatch) => {
    dispatch({ type: ActionType.FETCH_PARKING_PENDING });
    
    try {
      const response: ParkingResponse = await API.graphql(graphqlOperation(queries.parkingListWithoutSlots));
      const { data: { parking } } = response;

      dispatch({
        type: ActionType.FETCH_PARKING_SUCCESS,
        payload: parking
      });

    } catch(error) {
      dispatch({ type: ActionType.FETCH_PARKING_FAILURE, error });
    }
  }
