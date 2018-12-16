import React, { Attributes, ComponentType, ReactNode } from "react";
import { Forbidden } from "../components/root/Forbidden";
import { AuthService, IPermissionCollection } from "./AuthService";

export class TransitionService {

    public static getInstance(auth: AuthService = AuthService.getInstance()): TransitionService {
        if (!TransitionService.instance) {
            TransitionService.instance = new TransitionService(auth);
        }
        return TransitionService.instance;
    }

    private static instance: TransitionService;
    private idCounter = 1;

    constructor(private auth: AuthService) {
    }

    // tslint:disable-next-line:max-line-length
    public willTransitionTo = (componentClass: ComponentType, permissions?: IPermissionCollection, extraProps?: Attributes & any, children?: ReactNode[]) => {
        const id = this.idCounter++;
        this.auth.registerPermissions(id, permissions);
        extraProps = extraProps || {};
        return (props) => {
            return this.auth.hasAccessToState(id) ?
                React.createElement(componentClass, { ...props, ...extraProps }, children) :
                React.createElement(Forbidden, props);
        };
    }
}
