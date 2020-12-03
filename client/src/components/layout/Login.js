import React, { useEffect, useState, Fragment } from 'react';
import { connect } from 'react-redux';
import { Link, Redirect } from 'react-router-dom';
import PropTypes from 'prop-types';
import { setAlert } from '../../actions/alert';
import axios from 'axios';
import { loginUser,  checkRegistered } from '../../actions/auth';

const Login = ({
	auth: { isAuthenticated, isAdmin, loading },
    loginUser,
    setAlert
}) => {
    
    const [loginData, setLoginData] = useState({
        email: '',
        password: '',
    })

    const onLoginChange = e => {
        setLoginData({ ...loginData, [e.target.name]: e.target.value })
    }

    const [showLoader, toggleShowLoader] = useState(false);
    const onLogin  = async e => {
        e.preventDefault();
        toggleShowLoader(true);
		const config = {
			headers: {
				'Content-Type': 'application/json',
			},
		};

		const body = { 
            email: loginData.email
         };
        const res = await axios.post('/api/auth/check', body, config);
        switch (res.data) {
            case 1:
                loginUser(loginData);
                break;
            case 0:
                setAlert('Not yet registered', 'danger');
                break;
            default:
                break;
        }
        
    }    

    const onClose = e => {
        toggleLogin(false);
    }

    const [dotIndex, setDotIndex] = useState(0);
    
    var loaderInt = setInterval(rotate,500)

    function rotate() {
        const loaderDot1 = document.getElementById("loaderDot1");
        const loaderDot2 = document.getElementById("loaderDot2");
        const loaderDot3 = document.getElementById("loaderDot3");
        if(!loading && loaderDot1 && loaderDot2 && loaderDot3) {
            switch(dotIndex) {
                case 0:
                    loaderDot1.style.backgroundColor ="#00e1ff";
                    loaderDot2.style.backgroundColor ="#666666";
                    loaderDot3.style.backgroundColor ="#666666";
                    break;
                case 1:
                    loaderDot1.style.backgroundColor ="#666666";
                    loaderDot2.style.backgroundColor ="#00e1ff";
                    loaderDot3.style.backgroundColor ="#666666";
                    break;
                case 2:
                    loaderDot1.style.backgroundColor ="#666666";
                    loaderDot2.style.backgroundColor ="#666666";
                    loaderDot3.style.backgroundColor ="#00e1ff";
                    break;
                default:
                    break;
            }
            if(dotIndex < 2) {
                setDotIndex(dotIndex+1);
            }else{
                setDotIndex(0);
            }
            clearInterval(loaderInt);
        }
        
    }

    
    if(isAuthenticated && isAdmin) {
        return <Redirect to='/dashboard' />;
    }
    if(isAuthenticated && !isAdmin) {
        return <Redirect to='/' />;
    }
    
	return (
		<Fragment>
			<div className='overlay'>
                <form id="loginForm" onSubmit={(e) => onLogin(e)}>
                    <Link to="#" id="loginClose" onClick={(e) => onClose(e)}>
                        <i className="far fa-times-circle"></i>
                    </Link>
                    <h1 id="loginFormHeader">Sign in</h1>
                    <div className="form-group">
                        <input type="text" className="form-control" name="email" value={loginData.email} placeholder="Email" onChange={(e) => onLoginChange(e)} />
                    </div>
                    <div className="form-group">
                        <input type="password" className="form-control" name="password" value={loginData.password} placeholder="Password" onChange={(e) => onLoginChange(e)} />
                    </div>
                    <button type="submit" className="btn">Login</button>
                    {showLoader && (
                        <div id="logLoader">
                            <div className="loaderDot" id="loaderDot1"></div>
                            <div className="loaderDot" id="loaderDot2"></div>
                            <div className="loaderDot" id="loaderDot3"></div>
                        </div>
                    )}
                    <div id="logSwitch">
                        <span>Not registered yet? </span><Link to="#">Sign up</Link>
                    </div>
                </form>				
			</div>
		</Fragment>
	);
};

Login.propTypes = {
    registerUser: PropTypes.func.isRequired,
    loginUser: PropTypes.func.isRequired,
    checkRegistered: PropTypes.func.isRequired,
    setAlert: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
	auth: state.auth,
});

export default connect(mapStateToProps, { loginUser, checkRegistered, setAlert })(Login);