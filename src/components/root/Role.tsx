import { CrudMenu, IComponentProps, Navbar, PageTitle } from "@vesta/components";
import { Culture } from "@vesta/culture";
import { AclAction } from "@vesta/services";
import React, { ComponentType } from "react";
import { RouteComponentProps } from "react-router";
import { getAclInstance } from "../../service/Acl";
import { Go } from "../general/Go";
import { RoleAdd } from "./role/RoleAdd";
import { RoleDetail } from "./role/RoleDetail";
import { RoleEdit } from "./role/RoleEdit";
import { RoleList } from "./role/RoleList";

interface IRoleParams {}

interface IRoleProps extends IComponentProps, RouteComponentProps<IRoleParams> {}

export const Role: ComponentType<IRoleProps> = (props: IRoleProps) => {
  const access = getAclInstance().getAccessList("role");
  const tr = Culture.getDictionary().translate;

  return (
    <div className="page role-page has-navbar">
      <PageTitle title={tr("mdl_role")} />
      <Navbar title={tr("mdl_role")} onBurgerClick={openSidenav} />
      <CrudMenu path="role" access={access} />
      <div className="crud-wrapper">
        <Go path="/role/add" component={RoleAdd} permissions={{ role: [AclAction.Add] }} />
        <Go path="/role/edit/:id" component={RoleEdit} permissions={{ role: [AclAction.Edit] }} />
        <Go path="/role/detail/:id" component={RoleDetail} />
        <RoleList access={access} />
      </div>
    </div>
  );
};
