import { Html, IRouteComponentProps, Preloader, Sidenav, ToastMessage } from "@vesta/components";
import { Culture } from "@vesta/culture";
import { Storage } from "@vesta/services";
import React, { ComponentType, useContext, useEffect } from "react";
import { withRouter } from "react-router";
import { IRouteItem } from "../config/route";
import { IStore, Store } from "../service/Store";
import { SidenavContent } from "./general/SidenavContent";
import { ErrorBoundary } from "./root/ErrorBoundary";

interface IRootParams { }

interface IRootProps extends IRouteComponentProps<IRootParams> {
    routeItems: IRouteItem[];
}

const Root: ComponentType<IRootProps> = (props: IRootProps) => {

    const { store: { user, navbar, toast } } = useContext<IStore>(Store); // this.state;
    const { code, dir } = Culture.getLocale();

    useEffect(() => {
        // application behaviours
        window.onfocus = toForeground;
        document.addEventListener("resume", toForeground);
        window.onblur = toBackground;
        document.addEventListener("pause", toBackground);
        window.onunload = onExit;
        // global state
        // appStore.subscribe(() => {
        //     this.setState(appStore.getState());
        // });
    });

    const toastMsg = toast ?
        <ToastMessage message={toast.message} type={toast.type} onClose={onCloseToast} /> : null;

    return (
        <ErrorBoundary>
            <div id="main-wrapper" className="root-component">
                <Html lang={code} dir={dir} />
                <div id="content-wrapper">
                    {props.children}
                </div>
                <Sidenav open={navbar}>
                    <SidenavContent name="main-sidenav" user={user} menuItems={props.routeItems} />
                </Sidenav>
                {toastMsg}
                <Preloader />
            </div>
        </ErrorBoundary>
    );

    function onCloseToast() {
        // this.setState({ toast: null });
    }

    function onExit() {
        Storage.sync.set("lastPath", this.props.location.pathname);
    }

    function toBackground() {
        Storage.sync.set("inBackground", true);
    }

    function toForeground() {
        Storage.sync.set("inBackground", false);
    }
};

export default withRouter(Root as any);
