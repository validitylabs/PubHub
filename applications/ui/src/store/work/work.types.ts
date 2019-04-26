export interface IWork {
    id: number;
    title: string;
    author: string;
    year: number;
}

export interface IWorks {
    [key: number]: IWork;
}
