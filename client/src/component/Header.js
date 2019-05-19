import React, { Component } from "react";
import { BrowserRouter as Router, Link } from "react-router-dom";
import Route from "react-router-dom/Route";
import CommonService from "../services/common";
import {
    Container,
    Navbar,
    NavbarBrand,
    NavbarNav,
    NavbarToggler,
    Collapse,
    NavItem,
    NavLink,
    Fa
} from "mdbreact";
import Login from "./Login";

class Header extends Component {
    constructor(props) {
        super(props);
        this.state = {
            collapse: false
        };
        this.commonService = new CommonService();
        const currentRole = this.commonService.getLocalStorageData("role");
        this.onClick = this.onClick.bind(this);
    }

    logout = () => {
        this.commonService.removeLocalStorageData();
        window.location.reload();
    };

    onClick() {
        this.setState({
            collapse: !this.state.collapse
        });
    }
    render() {
        const bgPink = {
            backgroundColor: "#498fab",
            borderBottom: "3px solid #343a405e"
        };
        return (


            <nav className="navbar navbar-default navbar-fixed-top">
                <div className="container">
                    <div className="navbar-header">
                        <button type="button" className="navbar-toggle" data-toggle="collapse" data-target="#myNavbar">
                            <span className="icon-bar"></span>
                            <span className="icon-bar"></span>
                            <span className="icon-bar"></span>
                        </button>
                        <a className="navbar-brand" href="#myPage">Logo</a>
                    </div>
                    <div className="collapse navbar-collapse" id="myNavbar">
                        <ul className="nav navbar-nav navbar-right">
                            <li><a href="#about">ABOUT</a></li>
                            <li><a href="#services">SERVICES</a></li>
                            <li><a href="#portfolio">PORTFOLIO</a></li>
                            <li><a href="#pricing">PRICING</a></li>
                            <li><a href="#contact">CONTACT</a></li>
                        </ul>
                    </div>
                </div>
            </nav>
        );
    }
}

export default Header;
