import axios from 'axios';
import { setAlert } from './alert';
import {
	USER_REGISTERED,
	NOT_REGISTERED,
	REGISTER_FAIL,
	AUTH_ERROR,
	USER_LOGGEDIN,
	LOGIN_FAIL,
	LOGOUT,
	USER_LOADED
} from './types';
import setAuthToken from '../utils/setAuthToken';

// Load user
export const loadUser = () => async (dispatch) => {
	if (localStorage.token) {
		setAuthToken(localStorage.token);
	}
	try {
		const res = await axios.get(`api/auth/user`);
		dispatch({
			type: USER_LOADED,
			payload: res.data,
		});
	} catch (err) {
		dispatch({
			type: AUTH_ERROR,
		});
	}
};

// Register user
export const registerUser = (registerData) => async (
	dispatch
) => {
	const config = {
		headers: {
			'Content-Type': 'application/json',
		},
	};


	try {
		const res = await axios.post('/api/auth/register', registerData, config);

		dispatch({
			type: USER_REGISTERED,
			payload: res.data,
		});
		dispatch(loadUser());
	} catch (err) {
		const errors = err.response.data.errors;

		if (errors) {
			errors.forEach((error) => dispatch(setAlert(error.msg, 'danger')));
		}

		dispatch({
			type: REGISTER_FAIL,
		});
	}
};

// Check if registered
export const checkRegistered = (email) => async (dispatch) => {
	const config = {
		headers: {
			'Content-Type': 'application/json',
		},
	};

	const body = JSON.stringify({ email });
	try {
		const res = await axios.post('/api/auth/check', body, config);
		dispatch({
			type: NOT_REGISTERED,
			payload: res.data,
		});
	} catch (err) {
		const errors = err.response.data.errors;

		if (errors) {
			errors.forEach((error) => dispatch(setAlert(error.msg, 'danger')));
		}

		dispatch({
			type: REGISTER_FAIL,
		});
	}
};

// Login user
export const loginUser = (loginData) => async (dispatch) => {
	const config = {
		headers: {
			'Content-Type': 'application/json',
		},
	};
	try {
		const res = await axios.post('/api/auth/user', loginData, config);
		dispatch({
			type: USER_LOGGEDIN,
			payload: res.data,
		});
		dispatch(loadUser());
		return true;
	} catch (err) {

		if (err) {
			console.log(err);
		}

		dispatch({
			type: LOGIN_FAIL,
		});
	}
};

// Logout / Clear Profile
export const logout = () => (dispatch) => {
	dispatch({ type: LOGOUT });
};

