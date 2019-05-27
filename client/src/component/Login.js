import React, { Component } from "react";
import "./Login.css";
import { Redirect } from "react-router";
import CommonService from "../services/common";
import axios from "axios";
import validator from 'validator';
import GoogleLogin from "react-google-login";
import decode from "jwt-decode";
import FacebookLogin from 'react-facebook-login';
import keys from "../config/keys";
var $ = require("jquery");



class Login extends Component {
    constructor(props) {
        super(props);
        this.commonService = new CommonService();
        this.state = {
            email: "",
            name: "",
            password: "",
            confirmPassword: "",
            error: "",
            errorMessage: "",
            successMessage: ""
        }
    }

    validateEmail(email) {
        var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(String(email).toLowerCase());
    }

    validateRegisterData() {
        let error = "";
        if (!this.validateEmail(this.state.email))
            error += "Invalid Email Id \n";
        if (this.state.password !== this.state.confirmPassword)
            error += "password and confirm password not matching \n";
        return error;
    }

    clearError() {
        this.setState({ error: false });
        this.setState({ errorMessage: "" });
        this.setState({ successMessage: "" });
    }

    setError(message) {
        this.setState({ error: true });
        this.setState({ errorMessage: message });
    }

    register = (e) => {
        e.preventDefault();
        this.clearError();
        let self = this;
        let validateData = this.validateRegisterData();
        if (validateData) {
            this.setError(validateData);
        } else {
            let payload = {
                name: this.state.name,
                password: this.state.password,
                email: this.state.email
            }
            axios
                .post(`${keys.server}/api/users/register`, payload)
                .then(function (response) {
                    self.setState({ successMessage: "User succesfully registered" })
                })
                .catch(function (error) {
                    self.setError(JSON.stringify(error.response.data));
                });
        }
    }

    handleInputChange(event) {
        var name = event.target.name;
        this.setState({
            [name]: event.target.value
        });
    };

    Authenticate = () => {
        var self = this;
        // this.auth.login().then(data => {
        //   self.setState({ isUserLoggedIn: true });
        //   self.props.authenticateCallBack(true);
        // });
    };

    setTokenAndRoles = data => {
        var user = decode(data.token);
        this.commonService.setLocalStorageData("role", user.role);
        this.commonService.setLocalStorageData("token", data.token);
        this.commonService.setLocalStorageData("name", user.name);
        this.commonService.setLocalStorageData("image", user.image);
        this.commonService.setLocalStorageData("id", data.id);
        this.props.authenticateCallBack(true);
    };

    AuthenticateSocial = payload => {
        var self = this;
        axios
            .post(`${keys.server}/api/users/social`, payload)
            .then(function (response) {
                self.setTokenAndRoles(response.data);
            })
            .catch(function (error) {
                console.log(error);
            });
    };

    responseGoogle = response => {
        var user = {
            name: response.profileObj.name,
            email: response.profileObj.email,
            socialId: response.profileObj.googleId,
            imageUrl: response.profileObj.imageUrl,
            phoneNumber: ""
        };
        this.AuthenticateSocial(user);
    };

    responseFacebook = response => {
        var user = {
            name: response.name,
            email: response.email,
            socialId: response.userID,
            imageUrl: response.picture.data.url,
            phoneNumber: ""
        };
        console.log(response);
        this.AuthenticateSocial(user);
    };

    forgetPassword = () => {

    }

    toggleSignUpForm = () => {
        this.clearError();
        $('#logreg-forms .form-signin').toggle(); // display:block or none
        $('#logreg-forms .form-signup').toggle(); // display:block or none
    }

    toggleResetPasswordForm = () => {
        this.clearError();
        $('#logreg-forms .form-signin').toggle() // display:block or none
        $('#logreg-forms .form-reset').toggle() // display:block or none
    }

    resetPassword = () => {

    }

    signIn(e) {
        e.preventDefault();
        let self = this;
        let payload = {
            password: this.state.password,
            email: this.state.email
        }
        axios
            .post(`${keys.server}/api/users/login`, payload)
            .then(function (response) {
                self.setTokenAndRoles(response.data);
            })
            .catch(function (error) {
                self.setError(JSON.stringify(error.response.data));
            });
    }


    render() {
        if (this.props.isAuthenticated && this.commonService.isAdmin()) {
            return <Redirect to="/" />;
        } else if (this.props.isAuthenticated) {
            return <Redirect to="/" />;
        }
        return (
            <div id="logreg-forms">
                {this.state.error && <div class="alert alert-danger" role="alert">
                    {this.state.errorMessage}
                </div>}
                {this.state.successMessage && <div class="alert alert-success" role="alert">
                    {this.state.successMessage}
                </div>}
                <form className="form-signin">
                    <h1 className="h3 mb-3 font-weight-normal text-align-center"> Adi's App</h1>
                    <div className="social-login">
                        {/* <button className="btn facebook-btn social-btn" type="button"><span><i className="fab fa-facebook-f"></i> Sign in with Facebook</span> </button> */}
                        <FacebookLogin
                            appId={keys.facebook.clientID}
                            fields="name,email,picture"
                           // onClick={componentClicked}
                            callback={(res)=>{this.responseFacebook(res)}}
                            cssClass="btn facebook-btn social-btn"
                        />
                        <GoogleLogin
                            clientId={keys.google.clientID}
                            buttonText=" Sign in with Google+"
                            className="btn google-btn social-btn"
                            style={{}}
                            onSuccess={(res) => { this.responseGoogle(res) }}
                            // onFailure={(res) => { this.googleFailure(res) }}
                            cookiePolicy={'single_host_origin'}
                        />
                    </div>
                    <p className="text-align-center"> OR  </p>
                    <input type="email" id="inputEmail" className="form-control" placeholder="Email address" name="email"
                        value={this.state.email}
                        onChange={e => {
                            this.handleInputChange(e);
                        }} />
                    <input type="password" id="inputPassword" className="form-control" placeholder="Password" name="password"
                        value={this.state.password}
                        onChange={e => {
                            this.handleInputChange(e);
                        }} />

                    <button className="btn btn-success btn-block" type="submit" onClick={(e) => { this.signIn(e) }}><i className="fas fa-sign-in-alt"></i> Sign in</button>
                    <a href="#" id="forgot_pswd" onClick={() => { this.toggleResetPasswordForm() }}>Forgot password?</a>
                    <hr />
                    <button className="btn btn-primary btn-block" type="button" id="btn-signup" onClick={() => { this.toggleSignUpForm() }}><i className="fas fa-user-plus"></i> Sign up New Account</button>
                </form>

                <form action="/reset/password/" className="form-reset">
                    <input type="email" id="resetEmail" className="form-control" placeholder="Email address" name="email"
                        value={this.state.email}
                        onChange={e => {
                            this.handleInputChange(e);
                        }} />
                    <button className="btn btn-primary btn-block" type="submit" onClick={() => { this.resetPassword() }}>Reset Password</button>
                    <a href="#" id="cancel_reset" onClick={() => { this.toggleResetPasswordForm() }}><i className="fas fa-angle-left"></i> Back</a>
                </form>

                <form action="/signup/" className="form-signup">
                    <div className="social-login">
                        <button className="btn facebook-btn social-btn" type="button"><span><i className="fab fa-facebook-f"></i> Sign up with Facebook</span> </button>
                    </div>
                    <div className="social-login">
                        <button className="btn google-btn social-btn" type="button"><span><i className="fab fa-google-plus-g"></i> Sign up with Google+</span> </button>
                    </div>

                    <p className="text-align-center">OR</p>

                    <input type="text" id="user-name" className="form-control" placeholder="Full name" name="name"
                        value={this.state.name}
                        onChange={(e) => {
                            this.handleInputChange(e);
                        }}
                    />
                    <input type="email" id="user-email" className="form-control" placeholder="Email address" name="email"
                        value={this.state.email}
                        onChange={e => {
                            this.handleInputChange(e);
                        }} />
                    <input type="password" id="user-pass" className="form-control" placeholder="Password" name="password"
                        value={this.state.password}
                        onChange={e => {
                            this.handleInputChange(e);
                        }} />
                    <input type="password" id="user-repeatpass" className="form-control" placeholder="Repeat Password" name="confirmPassword"
                        value={this.state.assignedId}
                        onChange={e => {
                            this.handleInputChange(e);
                        }} />

                    <button className="btn btn-primary btn-block" type="submit" onClick={(e) => { this.register(e) }}><i className="fas fa-user-plus"></i> Sign Up</button>
                    <a href="#" id="cancel_signup" onClick={() => { this.toggleSignUpForm() }}><i className="fas fa-angle-left"></i> Back</a>
                </form>
                <br />
            </div>
        );
    }
}

export default Login;
