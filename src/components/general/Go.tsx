import { IComponentProps } from "@vesta/components";
import { IPermissions } from "@vesta/services";
import React, { ComponentType, useEffect } from "react";
import { Route } from "react-router";
import { getAcl } from "../../service/Acl";

interface IGoProps extends IComponentProps {
    component: ComponentType;
    exact?: boolean;
    path: string;
    permissions?: IPermissions;
}

export const Go: ComponentType<IGoProps> = (props: IGoProps) => {

    const acl = getAcl();
    const state = props.path;

    useEffect(() => {
        if (props.permissions) {
            acl.register(state, props.permissions);
        }
    }, [true]);

    return !props.permissions || acl.hasAccessToState(state) ?
        <Route path={props.path} component={props.component} exact={props.exact} /> : null;
};
