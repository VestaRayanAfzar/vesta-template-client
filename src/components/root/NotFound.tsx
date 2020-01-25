import { IComponentProps, Navbar, PageTitle } from "@vesta/components";
import { Culture } from "@vesta/culture";
import React, { ComponentType, useContext } from "react";
import { RouteComponentProps } from "react-router";
import { Store } from "../../service/Store";

interface INotFoundParams {}

interface INotFoundProps extends IComponentProps, RouteComponentProps<INotFoundParams> {}

export const NotFound: ComponentType<INotFoundProps> = (props: INotFoundProps) => {
  const { dispatch } = useContext(Store);
  const tr = Culture.getDictionary().translate;

  return (
    <div className="notFound-page page has-navbar">
      <PageTitle title={tr("notfound")} />
      <Navbar title={tr("notfound")} onBurgerClick={() => dispatch({ navbar: true })} />
      <h1>
        404 <small>Not found</small>
      </h1>
    </div>
  );
};
