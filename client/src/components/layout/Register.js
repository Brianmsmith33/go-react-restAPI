import React, { useEffect, useState, Fragment } from 'react';
import { connect } from 'react-redux';
import { Link, Redirect } from 'react-router-dom';
import PropTypes from 'prop-types';
import { setAlert } from '../../actions/alert';
import axios from 'axios';
import { registerUser } from '../../actions/auth';

const Register = ({
	auth: { isAuthenticated, isAdmin, user, loading },
    registerUser,
    setAlert
}) => {	
    
    const [registerData, setRegisterData] = useState({
        firstname: '',
        lastname: '',
        email: userEmail,
        password: '',
        confirm: '',
        isAdmin: isAuthenticated && user.isAdmin,
    })
    const {
        firstname,
        lastname,
        email,
        password,
        confirm,
    } = registerData;
    
    const onChange = e => {
        setRegisterData({ ...registerData, [e.target.name]: e.target.value })
    }

    const onRegister  = async e => {
        e.preventDefault();
        if(registerData.password === registerData.confirm){
            const emailRegex = new RegExp(
                /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
            );
            const emailValid = emailRegex.test(String(email).toLowerCase());
    
            if (!firstname || !lastname || !email) {
                setAlert('Please fill in required fields', 'danger');
            } else if (password !== confirm) {
                setAlert('Passwords do not match', 'danger');
            } else if (!emailValid) {
                setAlert('Please enter a valid email', 'danger');
            } else {
                const config = {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                };
                const body = JSON.stringify({ email });
                const res = await axios.post('/api/auth/check', body, config);
                switch(res.data) {
                    case 1:
                        registerUser(registerData);
                        break;
                    case 0:
                        setAlert('User already registered', 'danger');
                        break;
                    default:
                        break;
                }

                setRegisterData({
                    firstname: '',
                    lastname: '',
                    email: '',
                    password: '',
                    confirm: '',
                });
            }
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
			<div className="overlay">
                <form id="loginForm" onSubmit={(e) => onRegister(e)}>
                    <Link to="#" id="loginClose" onClick={() => toggleReg(false)}>
                        <i className="far fa-times-circle"></i>
                    </Link>
                    <h1 className="logHeader">Sign up</h1>
                    <br />
                    <div className="form-group">
                        <input type="text" className="form-control" name="firstname" value={firstname} placeholder="First name" onChange={(e) => onChange(e)} />
                    </div>
                    <div className="form-group">
                        <input type="text" className="form-control" name="lastname" value={lastname} placeholder="Last name" onChange={(e) => onChange(e)} />
                    </div>
                    <div className="form-group">
                        <input type="password" className="form-control" name="password" value={password} placeholder="Password" onChange={(e) => onChange(e)} />
                    </div>
                    <div className="form-group">
                        <input type="password" className="form-control" name="confirm" value={confirm} placeholder="Confirm Password" onChange={(e) => onChange(e)} />
                    </div>
                    <button type="submit" className="btn">Register</button>
                    
                    <div className="regSwitch">
                        <span style={{position: 'fixed'}}>Already registered? <Link to="#" onClick={(e) => toggleLogState("login")}>Sign in</Link></span>
                    </div>                    
                </form>
			</div>
		</Fragment>
	);
};

Register.propTypes = {
	isAuthenticated: PropTypes.bool,
	isAdmin: PropTypes.bool,
    registerUser: PropTypes.func.isRequired,
    setAlert: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
	auth: state.auth,
});

export default connect(mapStateToProps, { registerUser, setAlert })(Register);