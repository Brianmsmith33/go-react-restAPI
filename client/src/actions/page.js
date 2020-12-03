import axios from 'axios';
import { setAlert } from './alert';
import {
	TOGGLE_LOADING,
	PAGE_ERROR,
} from './types';

export const toggleLoading = () => async (dispatch) => {
	try {
		dispatch({
			type: TOGGLE_LOADING,
			payload: null,
		});
	} catch (err) {
		dispatch({
			type: PAGE_ERROR,
			payload: { msg: err, status: err },
		});
	}
};
