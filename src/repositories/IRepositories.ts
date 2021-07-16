interface IRepositories{
    
    getAll():Promise<any>;

    getPerId(id: string|number, relacao: string[]): Promise<any>;

    store(body: object): Promise<any>;

    setUpdate(body: object, id: string|number): Promise<any>;

    makeDelete(id: string|number): Promise<any>;
}
export {IRepositories};