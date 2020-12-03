import React, { Fragment, useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import Spinner from '../layout/Spinner';

const Home = ({  isAuthenticated, loading }) => {
	
	const [progress, setProgress] = useState(0);
	useEffect(() => {
		!loading &&
			setProgress((progress) => {
				return progress + 100;
			});
	}, [setProgress, loading]);
	
	
	return loading ? (
		<Spinner progress={progress} />
	) : (
		<Fragment>
			
		</Fragment>
	);
};

Home.propTypes = {
	loading: PropTypes.bool.isRequired,
};

const mapStateToProps = (state) => ({
	loading: state.auth.loading,
	isAuthenticated: state.auth.isAuthenticated,
});

export default connect(mapStateToProps, {})(Home);