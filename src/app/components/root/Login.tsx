import { Culture, IValidationError } from "@vesta/core";
import React, { FC, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { IUser, User } from "../../cmn/models/User";
import { ApiService } from "../../service/ApiService";
import { AuthService } from "../../service/AuthService";
import { NotificationService } from "../../service/NotificationService";
import { IModelValidationMessage, validationMessage } from "../../util/Util";
import { IBaseComponentWithRouteProps } from "../BaseComponent";
import { Alert } from "../general/Alert";
import { FormWrapper } from "../general/form/FormWrapper";
import { TextInput } from "../general/form/TextInput";
import Navbar from "../general/Navbar";
import { Preloader } from "../general/Preloader";

interface ILoginParams {
}

interface ILoginProps extends IBaseComponentWithRouteProps<ILoginParams> {
}

export const Login: FC<ILoginProps> = function (props: ILoginProps) {
    const tr = Culture.getDictionary().translate;
    const api = ApiService.getInstance();
    const auth = AuthService.getInstance();
    const notif = NotificationService.getInstance();
    const formErrorsMessages: IModelValidationMessage = {
        password: {
            maxLength: tr("err_max_length", 16),
            minLength: tr("err_min_length", 4),
            required: tr("err_required"),
        },
        username: {
            maxLength: tr("err_max_length", 16),
            minLength: tr("err_min_length", 4),
            required: tr("err_required"),
        },
    }
    // state
    const [user, setUser] = useState<IUser>({});
    const [validationErrors, setErrors] = useState<IValidationError>(null);
    const [loginError, setLoginError] = useState<string>("");


    useEffect(() => {
        if (!auth.isGuest()) {
            // if it's a user logout first
            props.history.push("/logout");
        }
    })

    const errors = validationErrors ? validationMessage(formErrorsMessages, validationErrors) : {};
    const loginErr = loginError ? <Alert type="error">{tr("err_wrong_user_pass")}</Alert> : null;

    return (
        <div className="page login-page has-navbar page-logo-form">
            <Navbar className="navbar-transparent" showBurger={true} />
            <div className="logo-wrapper">
                <div className="logo-container">
                    <img src="img/icons/144x144.png" alt="Vesta Logo" />
                </div>
            </div>
            <FormWrapper name="loginForm" onSubmit={onSubmit}>
                {loginErr}
                <TextInput name="username" label={tr("fld_username")} value={user.username}
                    error={errors.username} onChange={onChange} placeholder={true} />
                <TextInput name="password" label={tr("fld_password")} value={user.password} type="password"
                    error={errors.password} onChange={onChange} placeholder={true} />
                <p className="forget-link">
                    <Link to="forget">{tr("forget_pass")}</Link>
                </p>
                <div className="btn-group">
                    <button type="submit" className="btn btn-primary">{tr("login")}</button>
                    <Link to="register" className="btn btn-outline">{tr("register")}</Link>
                </div>
            </FormWrapper>
        </div>
    );


    function onChange(name: string, value: string) {
        user[name] = value;
        setUser(user);
    }

    function onSubmit() {
        const userInstance = new User(user);
        const validationResult = userInstance.validate("username", "password");
        if (validationResult) {
            return setErrors(validationResult);
        }
        Preloader.show();
        setErrors(null);
        api.post<IUser>("account/login", userInstance.getValues("username", "password"))
            .then((response) => {
                Preloader.hide();
                auth.login(response.items[0]);
            })
            .catch((error) => {
                Preloader.hide();
                setLoginError(tr("err_wrong_user_pass"));
                if (error.message == "err_db_no_record") { return; }
                notif.error(error.message);
            });
    }
}
