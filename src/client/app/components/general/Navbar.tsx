import React, {PureComponent} from "react";
import {withRouter} from "react-router";
import {BaseComponentProps} from "../BaseComponent";
import {Link} from "react-router-dom";
import {Burger} from "./Burger";
import {DevicePlugin} from "../../plugin/DevicePlugin";

export enum NavBarMainButtonType {Burger = 1, Back, Close}

export interface NavbarProps extends BaseComponentProps {
    title?: string;
    className?: string;
    backLink?: string;
    backAction?: (e) => void;
    showBurger?: boolean;
    hide?: boolean;
    mainButtonType?: NavBarMainButtonType;
}

class Navbar extends PureComponent<NavbarProps, null> {
    //<android>
    private pathToExitApps = ['/', '/login'];

    public componentDidMount() {
        DevicePlugin.getInstance().registerBackButtonHandler(this.goBack);
    }

    public componentWillUnmount() {
        DevicePlugin.getInstance().unregisterBackButtonHandler(this.goBack);
    }

    //</android>

    private goBack = (e) => {
        e && e.stopPropagation();
        const {backAction} = this.props;
        if (backAction) {
            return backAction(e);
        }
        const {history, backLink} = this.props;
        if (backLink) return history.replace(backLink);
        //<android>
        if (this.pathToExitApps.indexOf(this.props.location.pathname) >= 0) {
            return navigator['app'].exitApp();
        }
        //</android>
        if (history.length) return history.goBack();
        history.replace('/');
    }

    public render() {
        let {title, className, backLink, showBurger, hide, backAction, mainButtonType} = this.props;
        if (hide) return null;
        className = `navbar ${className || ''}`;
        title = title || '';
        let btnClassName = 'back-btn';
        if (mainButtonType == NavBarMainButtonType.Close) {
            btnClassName = 'close-btn';
        }
        let navBtn = (showBurger || location.pathname == '/') && !backLink && !backAction ?
            <Burger className="nav-btn" event="main-sidenav-toggle"/> :
            <Burger className={`nav-btn ${btnClassName}`} onClick={this.goBack}/>;

        return (
            <div className={className}>
                {navBtn}
                <p className="nav-title">{title}</p>
                <div className="navbar-btn-group">
                    {this.props.children}
                </div>
            </div>
        )
    }
}

export default withRouter(Navbar);