export interface IMenuItem {
    title: string;
    isAbstract?: boolean;
    url?: string;
    state?: string;
    children?: Array<IMenuItem>;
    icon?: string;
}

export const AppMenu: Array<IMenuItem> = [];
AppMenu.push({title: 'Dashboard', state: 'home', icon: 'home'});
AppMenu.push({
    title: 'Access Control',
    state: 'acl',
    isAbstract: true,
    url: 'acl',
    children: [
        {title: 'Role', state: 'acl.role'},
        {title: 'Role Group', state: 'acl.roleGroup'},
        {title: 'User', state: 'acl.user'}]
});

AppMenu.push({title: 'acc', state: 'acc'});
AppMenu.push({title: 'System Log', state: 'log'});
AppMenu.push({title: 'Configuration', state: 'appConfig'});
