export interface IWork {
    id: number;
    title: string;
    author: string;
    year: number;
}

export interface IWorks {
    [key: number]: IWork;
}

export interface IWorksState {
    isFetching: boolean;
    byId: IWorks;
}

export enum SearchActionTypes {
    SEARCH = '@@search/GET',
    DISPLAY = '@@display/GET'
}

export interface IReturnedWork {
    title: string;
    content: string;
    user: string;
    digest: string;
}

export interface IReturnedWorks {
    [key: number]: IReturnedWork;
}

export interface IReturnedWorksState {
    isFetching: boolean;
    byId: IReturnedWorks;
}