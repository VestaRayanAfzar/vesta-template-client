import React from "react";
import {Link} from "react-router-dom";
import {PageComponent, PageComponentProps, PageComponentState} from "../PageComponent";
import Navbar from "../general/Navbar";
import {IUser, User} from "../../cmn/models/User";
import {Preloader} from "../general/Preloader";
import {FormWrapper} from "../general/form/FormWrapper";
import {FormTextInput} from "../general/form/FormTextInput";
import {FieldValidationMessage, ModelValidationMessage, Util} from "../../util/Util";
import {Alert} from "../general/Alert";
import {AuthService} from "../../service/AuthService";
import {IValidationError} from "../../cmn/core/Validator";

export interface LoginParams {
}

export interface LoginProps extends PageComponentProps<LoginParams> {
}

export interface LoginState extends PageComponentState {
    showLoader: boolean;
    user: IUser;
    error: string;
    validationErrors?: IValidationError;
}

export class Login extends PageComponent<LoginProps, LoginState> {
    private auth = AuthService.getInstance();

    constructor(props: LoginProps) {
        super(props);
        this.state = {showLoader: false, user: {}, error: ''};
    }

    private onChange = (name: string, value: string) => {
        this.state.user[name] = value;
        this.setState({user: this.state.user});
    }

    private onSubmit = () => {
        let user = new User(this.state.user);
        let validationResult = user.validate('mobile', 'password');
        if (validationResult) {
            return this.setState({validationErrors: validationResult});
        }
        this.setState({showLoader: true, validationErrors: null});
        this.api.post<IUser>('account/login', user.getValues('mobile', 'password'))
            .then(response => {
                this.auth.login(response.items[0]);
                this.props.history.replace('/');
            }).catch(error => {
            this.notif.error(error.message);
            this.setState({showLoader: false, error: this.tr('err_wrong_user_pass')});
        })
    }

    public render() {
        const user = this.state.user;
        const formErrorsMessages: ModelValidationMessage = {
            mobile: {
                required: this.tr('err_required'),
                type: this.tr('err_phone')
            },
            password: {
                required: this.tr('err_required'),
                minLength: this.tr('err_min_length', 4),
                maxLength: this.tr('err_max_length', 16)
            }
        };
        let errors: FieldValidationMessage = this.state.validationErrors ? Util.validationMessage(formErrorsMessages, this.state.validationErrors) : {};
        let loginErr = this.state.error ? <Alert type="error">{this.tr('err_wrong_user_pass')}</Alert> : null;
        return (
            <div className="page login-page has-navbar page-logo-form">
                <Navbar className="navbar-transparent" showBurger={true}/>
                <Preloader show={this.state.showLoader}/>
                <div className="logo-wrapper">
                    <div className="logo-container">
                        <img src="img/vesta-logo.png" alt="Vesta Logo"/>
                    </div>
                </div>
                <FormWrapper name="loginForm" onSubmit={this.onSubmit}>
                    {loginErr}
                    <FormTextInput name="mobile" label={this.tr('fld_mobile')} value={user.mobile}
                                   error={errors.mobile} onChange={this.onChange} placeholder={true}/>
                    <FormTextInput name="password" label={this.tr('fld_password')} value={user.password} type="password"
                                   error={errors.password} onChange={this.onChange} placeholder={true}/>
                    <p className="forget-link">
                        <Link to="forget">{this.tr('forget_pass')}</Link>
                    </p>
                    <div className="btn-group">
                        <button type="submit" className="btn btn-primary">{this.tr('login')}</button>
                        <br/>
                        <Link to="register" className="btn">{this.tr('register')}</Link>
                    </div>
                </FormWrapper>
            </div>
        )
    }
}
