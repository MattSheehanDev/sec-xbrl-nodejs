

export interface IEntity {
    registrantName: string;
    centralIndexKey: string;
    documentType: string;
    focusPeriod: string;
    yearFocus: string;
    documentDate: string;
    amendment: string;
}


export class EntityModel {

    public readonly Name: string;
    public readonly CIK: string;
    public readonly Type: string;
    public readonly YearFocus: number;
    public readonly DocumentDate: Date;
    public readonly Amendment: boolean;

    constructor(options: IEntity) {
        this.Name = options.registrantName;
        this.CIK = options.centralIndexKey;
        this.Type = options.documentType;
        this.YearFocus = options.yearFocus ? parseInt(options.yearFocus) : null;
        this.DocumentDate = options.documentDate ? new Date(options.documentDate) : null;
        this.Amendment = options.amendment === 'true';
    }
}
