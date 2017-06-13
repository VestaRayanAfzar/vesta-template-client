import React from "react";
import {PageComponent, PageComponentProps, PageComponentState} from "../PageComponent";
import {AuthService} from "../../service/AuthService";

export interface SignupParams {
}

export interface SignupProps extends PageComponentProps<SignupParams> {
}

export interface SignupState extends PageComponentState {
}

export class Signup extends PageComponent<SignupProps, SignupState> {

    public render() {
        return (
            <div><h1>Signup Component</h1></div>
        );
    }

    static registerPermission(id) {
        AuthService.getInstance().registerPermissions(id, {account: ['signup']});
    }
}
