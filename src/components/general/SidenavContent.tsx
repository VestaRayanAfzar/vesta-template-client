import { Avatar, IComponentProps, Icon, IMenuItem, Menu, Navbar, Select } from "@vesta/components";
import { Culture } from "@vesta/culture";
import React, { FunctionComponent, useContext } from "react";
import { Link } from "react-router-dom";
import { IUser } from "../../cmn/models/User";
import defaultUserImage from "../../images/icons/192x192.png";
import { Store } from "../../service/Store";
import { getFileUrl } from "../../util";

interface ISidenavContentProps extends IComponentProps {
  menuItems: IMenuItem[];
  name: string;
}

interface ISidenavContentState {
  locale: number;
  user: IUser;
}

export const SidenavContent: FunctionComponent<ISidenavContentProps> = (props: ISidenavContentProps) => {
  const {
    state: { user },
    dispatch,
  } = useContext(Store);
  const tr = Culture.getDictionary().translate;
  const localeOptions = [
    { id: 1, locale: "fa-IR", title: tr("persian") },
    { id: 2, locale: "en-US", title: tr("english") },
  ];

  const locale = Culture.getLocale().code === "fa-IR" ? 1 : 2;

  const closeSidenav = () => {
    dispatch({ navbar: false });
  };

  const onLocaleChange = (name: string, value: number) => {
    const newLocale = localeOptions[value - 1].locale;
    Culture.setDefault(newLocale);
    (window as any).loadLocale(newLocale, true);
  };

  // public render() {
  const { menuItems } = props;
  // const { locale, user } = state;
  const editLink =
    user && user.id ? (
      <Link to="/profile" onClick={closeSidenav}>
        <Icon name="settings" />
      </Link>
    ) : null;
  let userImage: string = "";
  if (user.image) {
    userImage = getFileUrl(`user/${user.image}`);
  }

  return (
    <div className="sidenav-content has-navbar">
      <Navbar onClose={closeSidenav} />
      <Select name="lng" label={tr("locale")} value={locale} options={localeOptions} onChange={onLocaleChange} />
      <header>
        <Avatar src={userImage} defaultSrc={defaultUserImage} />
        <div className="name-wrapper">
          <h4>{user.username}</h4>
          {editLink}
        </div>
      </header>
      <main>
        <Menu name="nav" items={menuItems} onItemSelect={closeSidenav} />
      </main>
    </div>
  );
};
