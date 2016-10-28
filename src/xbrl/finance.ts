import TenK from './tenk';


module Finance {


    export function CalcWorkingCapital(currentAssets: number, currentLiab: number) {
        // Current Assets - Current Liabilities
        return currentAssets - currentLiab;
    }
    export function CalcProfitMargin(netIncome: number, totalRevenue: number) {
        // Net Income / Total Revenue
        return netIncome / totalRevenue;
    }
    export function CalcCurrentAssetsRatio(currentAssets: number, currentLiab: number) {
        // Current Assets / Current Liabilities
        return currentAssets / currentLiab;
    }
    export function CalcWorkingCapitalToDebtRatio(workingCapital: number, debt: number) {
        // Working Capital / Long-Term Debt
        return workingCapital / debt;
    }



    export function CalcMarketCapitalization(sharePrice: number, outstandingShares: number) {
        // Share Price * Outstanding Shares
        return sharePrice * outstandingShares;
    }
    export function CalcPriceToEarningsRatio(sharePrice: number, earnings: number) {
        // Share Price / Earnings
        return sharePrice / earnings
    }



    export function CalcAverageEarningsPerShare(tens: TenK[]) {
        let sum = 0;
        for (let ten of tens) {
            sum += ten.GetEarningsPerShare();
        }
        return Round(sum / tens.length, 2);
    }
    export function CalcAverageDilutedEarningsPerShare(tens: TenK[]) {
        let sum = 0;
        for (let ten of tens) {
            sum += ten.GetDilutedEarningsPerShare();
        }
        return Round(sum / tens.length, 2);
    }



    function Round(val: number, len: number) {
        len = Math.pow(10, len);
        return Math.round(val * len) / len;
    }

}

export default Finance;
