import React, { Fragment } from 'react';

const NotFound = () => {
	return (
		<Fragment>
			<div className='notBox'>
				<h1 className='x-large text-dark text-center pageNotFound'>
					<i className='fas fa-exclamation-triangle exclamation'></i> Page Not
					Found <i className='fas fa-exclamation-triangle exclamation'></i>
				</h1>
				<div className='row notFound'>
					<h1 className='four-left'>404</h1>
					
				</div>
				<p className='large text-center text-dark notFoundMessage'>
					Sorry, this page does not exist
				</p>
				
			</div>
		</Fragment>
	);
};

export default NotFound;
