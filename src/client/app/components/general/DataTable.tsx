import React, { Component } from "react";
import { IQueryRequest } from "../../medium";
import { shallowClone } from "../../util/Util";
import { BaseComponentProps } from "../BaseComponent";
import Pagination from "./Pagination";

export interface IColumn<T> {
    name?: string;
    render?: (record: T) => any;
    title?: string;
}

export interface IDataTableQueryOption<T> extends IQueryRequest<T> {
    total?: number;
}

interface IDataTableProps<T> extends BaseComponentProps {
    columns: Array<IColumn<T>>;
    fetch?: (option: IDataTableQueryOption<T>) => void;
    pagination?: boolean;
    queryOption?: IDataTableQueryOption<T>;
    records: Array<T>;
    selectable?: boolean;
    showIndex?: boolean;
}

interface IDataTableState {
}

export class DataTable<T> extends Component<IDataTableProps<T>, IDataTableState> {
    private headerRow;

    constructor(props: IDataTableProps<T>) {
        super(props);
        this.state = { records: [] };
    }

    public componentDidMount() {
        this.createHeader();
    }

    public render() {
        const rows = this.createRows();
        const queryOption = this.props.queryOption;
        const pagination = this.props.pagination ?
            <Pagination totalRecords={queryOption.total} currentPage={queryOption.page} fetch={this.onPaginationChange} recordsPerPage={queryOption.limit} /> : null;
        return (
            <div>
                <div className="data-table">
                    <table>
                        <thead>{this.headerRow}</thead>
                        <tbody>{rows}</tbody>
                    </table>
                </div>
                {pagination}
            </div>
        );
    }

    private createHeader() {
        const headerCells = this.props.columns.map((col, i) => {
            return <th key={i + 1}>{col.title || col.name}</th>;
        });
        this.headerRow = <tr>{headerCells}</tr>;
    }

    private createRows() {
        const rows = this.props.records || [];
        return rows.map((r, i) => {
            const cells = this.props.columns.map((c, j) => (<td key={j + 1}>{c.render ? c.render(r) : r[c.name]}</td>));
            return <tr key={i + 1}>{cells}</tr>;
        });
    }

    private onPaginationChange = (page: number, recordsPerPage: number) => {
        const queryOption = shallowClone<IQueryRequest<T>>(this.props.queryOption);
        queryOption.page = +page;
        queryOption.limit = recordsPerPage;
        this.props.fetch(queryOption);
    }
}
