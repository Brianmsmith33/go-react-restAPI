import React, { useEffect, Fragment } from 'react';
import { Route, Switch } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Home from '../home/Home';
import Alert from '../layout/Alert';
import PrivateRoute from './PrivateRoute';
import NotFound from '../layout/NotFound';

const Routes = ({ darkMode, getPage, loading }) => {
	
	return (
		<Fragment>
			<Alert />
				<Switch>
					<Route exact path='/' component={Home} />
					<Route component={NotFound} />
				</Switch>
		</Fragment>
	);
};

Routes.propTypes = {
	loading: PropTypes.bool.isRequired,
};

const mapStateToProps = (state) => ({
	loading: state.auth.loading,
});

export default connect(mapStateToProps, {})(Routes);
