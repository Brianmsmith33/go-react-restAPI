import React, { Fragment, useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { toggleLoading } from '../../actions/page';
import spinner from '../../assets/images/spinner.gif';

const Spinner = ({ progress, toggleLoading }) => {
	useEffect(() => {
		if (progress === 100) {
			setTimeout(() => {
				toggleLoading();
			}, 1500);
		}
	}, [toggleLoading, progress]);
	return (
		<Fragment>
			<div className='row'>
				<div className='col-5'></div>
				<div className='col-2 m-auto'>
					<img src={spinner} className='spinner' alt='Loading...' />

					<div className='loadingBar m-auto'>
						<div
							className='progress'
							style={{
								width: progress + '%',
							}}
						></div>
					</div>
				</div>

				<div className='col-5'></div>
			</div>
		</Fragment>
	);
};

Spinner.propTypes = {
	toggleLoading: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
});

export default connect(mapStateToProps, {
	toggleLoading,
})(Spinner);
