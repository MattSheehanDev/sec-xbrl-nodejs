
export interface TenKValues {
    year: number;
    type: '10-K'|'10-Q'|string;
    date: string;
    totalRevenue: number;
    netIncome: number;
    eps: number;
    dilutedEps: number;
    declaredDividend: number;
    outstandingShares: number;
    dilutedOutstandingShares: number;
    prefOutstandingShares: number;
    currentAssets: number;
    currentLiab: number;
    longTermDebt: number;
}


export class TenK {

    public readonly Year: number;
    public readonly Date: Date;
    public readonly Type: string;

    public readonly TotalRevenue: number;
    public readonly NetIncome: number;
    public readonly EarningsPerShare: number;
    public readonly DilutedEarningsPerShare: number;
    public readonly DeclaredDividend: number;

    public readonly OutstandingShares: number;
    public readonly DilutedOutstandingShares: number;
    
    public readonly PrefOutstandingShares: number;
    public readonly CurrentAssets: number;
    public readonly CurrentLiabiliites: number;
    public readonly LongTermDebt: number;

    constructor(values: TenKValues) {
        this.Year = values.year;
        // date should be in YYYY-MM-DD format
        this.Date = new Date(values.date);
        this.Type = values.type;

        this.TotalRevenue = values.totalRevenue;
        this.NetIncome = values.netIncome;
        this.EarningsPerShare = values.eps;
        this.DilutedEarningsPerShare = values.dilutedEps;
        this.DeclaredDividend = values.declaredDividend;
        
        this.OutstandingShares = values.outstandingShares;
        this.DilutedOutstandingShares = values.dilutedOutstandingShares;
        
        this.PrefOutstandingShares = values.prefOutstandingShares;
        this.CurrentAssets = values.currentAssets;
        this.CurrentLiabiliites = values.currentLiab;
        this.LongTermDebt = values.longTermDebt;
    }

}

export default TenK;
