
export interface SECFiling {
    formType: string;
    url: string;
    desc: string;
    desc2: string;
    filingDate: string;
    fileUrl: string;
    fileNum: string;                // often null
    filmNum: string;                // often null
}

export interface SECDocument {
    title: string;
    url: string;
    name: string
    type: string;
    size: string;
}