import { Culture, IValidationError } from "@vesta/core";
import React, { FC, useState } from "react";
import { Link } from "react-router-dom";
import { IUser, User } from "../../cmn/models/User";
import { ApiService } from "../../service/ApiService";
import { NotificationService } from "../../service/NotificationService";
import { getFileUrl, IModelValidationMessage, validationMessage } from "../../util/Util";
import { IBaseComponentWithRouteProps } from "../BaseComponent";
import { FormWrapper } from "../general/form/FormWrapper";
import { TextInput } from "../general/form/TextInput";
import Navbar from "../general/Navbar";
import { Preloader } from "../general/Preloader";

interface IRegisterParams {
}

interface IRegisterProps extends IBaseComponentWithRouteProps<IRegisterParams> {
}

interface IRegisterState {
    user: IUser;
    validationErrors: IValidationError;
}

export const Register: FC<IRegisterProps> = function (props: IRegisterProps) {
    const tr = Culture.getDictionary().translate;
    const api = ApiService.getInstance();
    const notif = NotificationService.getInstance()
    const formErrorsMessages: IModelValidationMessage = {
        password: {
            assert: tr("err_max_length", 16),
            minLength: tr("err_min_length", 6),
            required: tr("err_required"),
        },
        username: {
            maxLength: tr("err_max_length", 64),
            minLength: tr("err_min_length", 4),
            required: tr("err_required"),
        },
    };
    // state
    const [user, setUser] = useState<IUser>({});
    const [validationErrors, setErrors] = useState<IValidationError>(null);

    user.image = getFileUrl(user.image as string);
    const errors = validationErrors ? validationMessage(formErrorsMessages, validationErrors) : {};

    return (
        <div className="page register-page has-navbar page-logo-form">
            <Navbar className="navbar-transparent" showBurger={true} />
            <div className="logo-wrapper">
                <div className="logo-container">
                    <img src="img/icons/144x144.png" alt="Vesta Logo" />
                </div>
            </div>
            <FormWrapper onSubmit={onSubmit}>
                <TextInput name="username" label={tr("fld_username")} value={user.username}
                    error={errors.username} onChange={onChange} dir="ltr" />
                <TextInput name="password" label={tr("fld_password")} value={user.password}
                    error={errors.password} onChange={onChange} type="password" dir="ltr" />
                <div className="agreement">
                    {tr("register_accept")}
                    &nbsp;(<a href="https://vesta.bz" target="_blank">{tr("rules")}</a>,
                        <a href="https://vesta.bz" target="_blank">{tr("privacy")}</a>)
                    </div>
                <div className="btn-group">
                    <button type="submit" className="btn btn-primary">{tr("register")}</button>
                    <Link className="btn btn-outline" to="/">{tr("login")}</Link>
                </div>
            </FormWrapper>
        </div>
    );


    function onChange(name: string, value: any) {
        user[name] = value;
        setUser(user);
    }

    function onSubmit() {
        const userModel = new User(user);
        const validationErrors = userModel.validate("username", "password");
        if (validationErrors) {
            setErrors(validationErrors);
        }
        Preloader.show();
        setErrors(null);
        api.post<IUser>("account", userModel.getValues("username", "password"))
            .then((response) => {
                Preloader.hide();
                notif.success("msg_register_ok");
                props.history.push("/");
            })
            .catch((error) => {
                Preloader.hide();
                notif.error(error.message);
            });
    }
}
