import React, { Fragment, useEffect } from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import Routes from './components/routing/Routes';
import { Provider } from 'react-redux';
import store from './utils/store';
import { loadUser } from './actions/auth';
import './scss/Base.scss';
import setAuthToken from './utils/setAuthToken';
import { LOAD } from './actions/types';


const App = () => {
  if (localStorage.token) {
    setAuthToken(localStorage.token);
  }
  
	useEffect(() => {
		if(localStorage.token){
			store.dispatch(loadUser());
		}else{
			store.dispatch({
				type: LOAD,
				payload: null,
			})
		}
	}, []);

	return (
		<Provider store={store}>
			<Router>
				<Fragment>
					<Navbar />
					<Route component={Routes} />
				</Fragment>
			</Router>
		</Provider>
	);
};

export default App;
