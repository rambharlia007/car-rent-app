import React, { Component } from "react";
import "./Login.css";
import { Redirect } from "react-router";
import CommonService from "../services/common";
import axios from "axios";

import GoogleLogin from "react-google-login";
import decode from "jwt-decode";

import keys from "../config/keys";

class Login extends Component {
    state = { userName: "", password: "", isUserLoggedIn: false };

    constructor(props) {
        super(props);
        this.commonService = new CommonService();
    }




    HandleInputChange = event => {
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
        this.commonService.setLocalStorageData("name", user.username);
        this.commonService.setLocalStorageData("image", user.imageUrl);
        this.commonService.setLocalStorageData("id", data.id);
        this.props.authenticateCallBack(true);
    };

    AuthenticateSocial = payload => {
        var self = this;
        payload.role = this.common;
        axios
            .post("/auth/login", payload)
            .then(function (response) {
                self.setTokenAndRoles(response.data);
            })
            .catch(function (error) {
                console.log(error);
            });
    };

    responseGoogle = response => {
        var user = {
            userName: response.profileObj.name,
            emailId: response.profileObj.email,
            socialId: response.profileObj.googleId,
            imageUrl: response.profileObj.imageUrl,
            phoneNumber: ""
        };
        this.AuthenticateSocial(user);
    };

    responseFacebook = response => {
        var user = {
            userName: response.name,
            emailId: response.email,
            socialId: response.userID,
            imageUrl: response.picture.data.url,
            phoneNumber: ""
        };
        console.log(response);
        this.AuthenticateSocial(user);
    };


    outlookAuthHandler = (err, response) => {
        var user = {
            userName: response.displayName,
            emailId: response.userPrincipalName,
            socialId: response.id,
            imageUrl: "",
            phoneNumber: response.mobilePhone
        };
        this.AuthenticateSocial(user);
    }

    render() {
        // if (this.props.isAuthenticated && this.commonService.isAdmin()) {
        //     return <Redirect to="/list/applicant" />;
        // } else if (this.props.isAuthenticated) {
        //     return <Redirect to="/new/applicant" />;
        // }
        return (
            <div id="logreg-forms">
                <form className="form-signin">
                    <h1 className="h3 mb-3 font-weight-normal text-align-center"> Sign in</h1>
                    <div className="social-login">
                        <button className="btn facebook-btn social-btn" type="button"><span><i className="fab fa-facebook-f"></i> Sign in with Facebook</span> </button>
                        <button className="btn google-btn social-btn" type="button"><span><i className="fab fa-google-plus-g"></i> Sign in with Google+</span> </button>
                    </div>
                    <p className="text-align-center"> OR  </p>
                    <input type="email" id="inputEmail" className="form-control" placeholder="Email address" required="" autofocus="" />
                    <input type="password" id="inputPassword" className="form-control" placeholder="Password" required="" />

                    <button className="btn btn-success btn-block" type="submit"><i className="fas fa-sign-in-alt"></i> Sign in</button>
                    <a href="#" id="forgot_pswd">Forgot password?</a>
                    <hr />
                    <button className="btn btn-primary btn-block" type="button" id="btn-signup"><i className="fas fa-user-plus"></i> Sign up New Account</button>
                </form>

                <form action="/reset/password/" className="form-reset">
                    <input type="email" id="resetEmail" className="form-control" placeholder="Email address" required="" autofocus="" />
                    <button className="btn btn-primary btn-block" type="submit">Reset Password</button>
                    <a href="#" id="cancel_reset"><i className="fas fa-angle-left"></i> Back</a>
                </form>

                <form action="/signup/" className="form-signup">
                    <div className="social-login">
                        <button className="btn facebook-btn social-btn" type="button"><span><i className="fab fa-facebook-f"></i> Sign up with Facebook</span> </button>
                    </div>
                    <div className="social-login">
                        <button className="btn google-btn social-btn" type="button"><span><i className="fab fa-google-plus-g"></i> Sign up with Google+</span> </button>
                    </div>

                    <p className="text-align-center">OR</p>

                    <input type="text" id="user-name" className="form-control" placeholder="Full name" required="" autofocus="" />
                    <input type="email" id="user-email" className="form-control" placeholder="Email address" required autofocus="" />
                    <input type="password" id="user-pass" className="form-control" placeholder="Password" required autofocus="" />
                    <input type="password" id="user-repeatpass" className="form-control" placeholder="Repeat Password" required autofocus="" />

                    <button className="btn btn-primary btn-block" type="submit"><i className="fas fa-user-plus"></i> Sign Up</button>
                    <a href="#" id="cancel_signup"><i className="fas fa-angle-left"></i> Back</a>
                </form>
                <br />
            </div>
        );
    }
}

export default Login;
