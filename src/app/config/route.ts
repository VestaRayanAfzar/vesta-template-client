import { ComponentClass } from "react";
import { About } from "../components/root/About";
import { Forget } from "../components/root/Forget";
import { Home } from "../components/root/Home";
import { Login } from "../components/root/Login";
import { Logout } from "../components/root/Logout";
import { Profile } from "../components/root/Profile";
import { Register } from "../components/root/Register";
import { Support } from "../components/root/Support";
import { Translate } from "../medium";
import { IPermissionCollection } from "../service/AuthService";

export interface IRouteItem {
    abstract?: boolean;
    children?: IRouteItem[];
    component?: ComponentClass<any>;
    exact?: boolean;
    // show/hide this item in menu list
    hidden?: boolean;
    // show icon on menu
    icon?: string;
    link: string;
    permissions?: IPermissionCollection;
    title: string;
}

export function getRoutes(isLoggedIn: boolean): IRouteItem[] {
    const tr = Translate.getInstance().translate;
    const commonRoutes = [
        { link: "about", title: tr("about"), component: About },
        { link: "contact", title: tr("contact_us"), component: Support },
    ];
    return isLoggedIn ? [
        { link: "", title: tr("home"), component: Home, exact: true },
        ...commonRoutes,
        { link: "profile", title: tr("profile"), component: Profile },
        { link: "logout", title: tr("logout"), component: Logout },
    ] : [
            { link: "", title: tr("login"), component: Login, exact: true },
            ...commonRoutes,
            { link: "forget", title: tr("forget_pass"), component: Forget, hidden: true },
            { link: "register", title: tr("register"), component: Register },
        ];
}
