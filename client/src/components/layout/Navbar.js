import React, { Fragment, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { logout } from '../../actions/auth';

const Navbar = ({
    auth: {loading, isAuthenticated, user},
    logout
}) => {
    
    const [showDrop, setShowDrop] = useState(false);
    const toggleDrop = e => {
        if(showDrop){
            document.getElementById('accountDropBox').style.opacity = '0';
            setShowDrop(false);
        }else{
            document.getElementById('accountDropBox').style.opacity = '0.9';
            setShowDrop(true);
        }
    }
    
	return (
		<Fragment>
            {isAuthenticated && (
                <Fragment>
                    <nav>
                        <div className="row" id="navLinks">
                            <div className="row" id="routes">
                                <div className="col-3">
                                    {user && user.isAdmin ? (
                                        <Link to="/dashboard" className="navLink nav-link">
                                            Dashboard
                                        </Link>
                                    ):(
                                        <Link to="/" className="navLink nav-link">
                                            Home
                                        </Link>
                                    )}
                                </div>
                            </div>
                            
                            <img id="avatar" src={user && user.avatar} alt="" />
                            <Link to="#" id="accountDrop" onClick={(e) => toggleDrop(e)}>
                                <i className="fas fa-caret-down"></i>
                            </Link>
                           
                        </div>
                    </nav>
                    <div id="accountDropBox">
                        <Link className="row accountDropLink" to="#" id="logoutLink" onClick={() => logout()}>
                            Sign out
                        </Link>
                    </div>
                </Fragment>
            )}
			
            {!isAuthenticated && (
                <Link to="#" className="btn" id="loginLink">Sign in</Link>
            )}
            
		</Fragment>
	);
};

Navbar.propTypes = {
};


const mapStateToProps = (state) => ({
	auth: state.auth,
});

export default connect(mapStateToProps, {
    logout,
})(Navbar);
