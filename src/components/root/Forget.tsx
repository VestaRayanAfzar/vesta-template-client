import { Alert, Button, FormWrapper, MessageType, Navbar, Preloader, TextInput } from "@vesta/components";
import { IResponse } from "@vesta/core";
import { IValidationError } from "@vesta/core/Validator";
import { Culture } from "@vesta/culture";
import React, { FC, useState } from "react";
import { Link } from "react-router-dom";
import { IUser, User } from "../../cmn/models/User";
import { getApi } from "../../service/Api";
import { Notif } from "../../service/Notif";
import { IModelValidationMessage, validationMessage } from "../../util/Util";
import { IBaseComponentWithRouteProps } from "../BaseComponent";

interface IForgetParams {
}

interface IForgetProps extends IBaseComponentWithRouteProps<IForgetParams> {
}

export const Forget: FC<IForgetProps> = function (props: IForgetProps) {
    const tr = Culture.getDictionary().translate;
    const notif = Notif.getInstance();
    const api = getApi();
    const formErrorsMessages: IModelValidationMessage = {
        mobile: {
            invalid: tr("err_invalid_phone"),
            maxLength: tr("err_max_length", 12),
            minLength: tr("err_min_length", 9),
            required: tr("err_required"),
            type: tr("err_phone"),
        },
    };
    // states
    const [message, setMessage] = useState<string>("");
    const [mobile, setMobile] = useState<string>("");
    const [validationErrors, setErrors] = useState<IValidationError>(null);

    const errors = validationErrors ? validationMessage(formErrorsMessages, validationErrors) : {};
    const alert = message ? <Alert type={MessageType.Info}>{message}</Alert> : null;

    return (
        <div className="page forget-page has-navbar page-logo-form">
            <div className="logo-wrapper">
                <div className="logo-container">
                    <img src="images/icons/144x144.png" alt="Vesta Logo" />
                </div>
            </div>
            <FormWrapper name="ForgetForm" onSubmit={onSubmit}>
                {alert}
                <TextInput name="mobile" label={tr("fld_mobile")} value={mobile} error={errors.mobile} onChange={onChange} />
                <div className="btn-group">
                    <Button type="button" color="primary">
                        <Link to="/">{tr("login")}</Link>
                    </Button>
                    <Button color="primary" variant="outlined">{tr("send_reset")}</Button>
                </div>
            </FormWrapper>
        </div>
    );


    function onChange(name: string, value: any) {
        setMobile(value);
    }

    function onSubmit() {
        const user = new User({ mobile });
        const validationErrors = user.validate("mobile");
        if (validationErrors) {
            return setErrors(validationErrors);
        }
        Preloader.show();
        setErrors(null);
        api.post<IUser, IResponse<IUser>>("account/forget", { mobile })
            .then((response) => {
                Preloader.hide();
                notif.success(tr("info_forget"));
                props.history.push("/");
            })
            .catch((error) => {
                Preloader.hide();
                setErrors(error.violations);
            });
    }
}
