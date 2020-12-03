import {
	USER_REGISTERED,
	NOT_REGISTERED,
	REGISTER_FAIL,
	USER_LOADED,
	AUTH_ERROR,
	USER_LOGGEDIN,
	LOGIN_FAIL,
	LOGOUT,
	ACCOUNT_DELETED,
	LOAD,
} from '../actions/types';

const initialState = {
	token: localStorage.getItem('token'),
	isAuthenticated: null,
	loading: true,
	user: {},
	data: null,
};

export default function (state = initialState, action) {
	const { type, payload } = action;
	switch (type) {
		case USER_LOADED:
			return {
				...state,
				isAuthenticated: true,
				isAdmin: false,
				loading: false,
				user: payload
			};
		case NOT_REGISTERED:
			return {
				...state,
				isAuthenticated: false,
				isAdmin: false,
				loading: false,
				admin: null,
				data: payload,
			};
		case USER_REGISTERED:
		case USER_LOGGEDIN:
			localStorage.setItem('token', payload);
			return {
				...state,
				isAuthenticated: true,
				loading: false,
			};
		case LOAD:
			return{
				...state,
				loading: false,
			}
		case REGISTER_FAIL:
		case AUTH_ERROR:
		case LOGIN_FAIL:
		case LOGOUT:
		case ACCOUNT_DELETED:
			localStorage.removeItem('token');
			return {
				...state,
				token: null,
				isAuthenticated: false,
				isAdmin: false,
				loading: false,
				data: null,
			};
		default:
			return state;
	}
}
