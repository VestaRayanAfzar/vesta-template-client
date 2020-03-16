import { IComponentProps, Navbar, PageTitle } from "@vesta/components";
import { Culture } from "@vesta/culture";
import React, { ComponentType } from "react";
import { RouteComponentProps } from "react-router";
import { useStore } from "../../service/Store";

interface IForbiddenParams {}

interface IForbiddenProps extends IComponentProps, RouteComponentProps<IForbiddenParams> {}

export const Forbidden: ComponentType<IForbiddenProps> = (props: IForbiddenProps) => {
  const { dispatch } = useStore();
  const tr = Culture.getDictionary().translate;

  return (
    <div className="forbidden-page page has-navbar">
      <PageTitle title={tr("err_forbidden")} />
      <Navbar title={tr("err_forbidden")} onBurgerClick={() => dispatch({ navbar: true })} />
      <h1>
        403 <small>Forbidden</small>
      </h1>
    </div>
  );
};
