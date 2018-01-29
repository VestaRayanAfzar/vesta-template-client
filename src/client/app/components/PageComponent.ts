import { Component } from "react";
import { match } from "react-router";
import { IQueryRequest } from "../medium";
import { ApiService } from "../service/ApiService";
import { AuthService } from "../service/AuthService";
import { ConfigService, IPaginationConfig } from "../service/ConfigService";
import { NotificationService } from "../service/NotificationService";
import { TransitionService } from "../service/TransitionService";
import { TranslateService } from "../service/TranslateService";
import { BaseComponentProps } from "./BaseComponent";
import { IDataTableQueryOption } from "./general/DataTable";

export type FetchById<T> = (id: number) => Promise<T>;

export type Search<T> = (term: string) => Promise<Array<T>>;

export type FetchAll<T> = (query: IQueryRequest<T> | IDataTableQueryOption<T>) => void;

export type Save<T> = (model: T) => void;

export interface IPageComponentProps<T> extends BaseComponentProps {
    match?: match<T>;
}

export abstract class PageComponent<P, S> extends Component<P, S> {
    protected api: ApiService = ApiService.getInstance();
    protected auth: AuthService = AuthService.getInstance();
    protected notif: NotificationService = NotificationService.getInstance();
    protected pagination: IPaginationConfig = ConfigService.getConfig().pagination;
    protected tr = TranslateService.getInstance().translate;
    protected tz = TransitionService.getInstance().willTransitionTo;
}