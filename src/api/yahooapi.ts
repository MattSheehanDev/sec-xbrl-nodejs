import API from './api';


namespace YahooAPI {

    const YQL_URL = 'https://query.yahooapis.com/v1/public/yql';
    
    // TODO: multiple ticker symbols
    // TODO: move startDate, endDate tp GetHistoricalPrice
    export function GetPrice(ticker: string, startDate: string, endDate: string): Promise<Result> {
        // yahoo.finance.quotes
        // yahoo.finance.historicaldata
        let query = `select * from yahoo.finance.quotes where symbol in ("${ticker}")`;
        // query += ` and startDate = "${startDate}" and endDate = "${endDate}"`;

        let format = 'format=json';
        let env = `env=${encodeURIComponent('http://datatables.org/alltables.env')}`;
        // let env = `env=${encodeURIComponent('store://datatables.org/alltableswithkeys')}`;
        
        let component = `q=${encodeURIComponent(query)}&${format}&${env}`;
        let uri = `${YQL_URL}?${component}`;

        // let d = decodeURI(yql);
        // let d2 = decodeURI(uri);
        // console.log(d);
        // console.log(d2);
        
        return new Promise<Result>((resolve: Function, reject: Function) => {
            API.Get(uri).then((value: string) => {
                console.log(value);
                let result: Result = JSON.parse(value);
                resolve(result);

            }, (err: any) => {

                resolve(err);
            });
        });
    }




    export interface Result {
        query: {
            count: number;                  // number of quotes
            created: string;                // YYYY-MM-DDTHH:MM:SSZ
            lang: string;
            results: {
                quote: Quote | Quote[];
            }            
        }
    }

    export interface Quote {
        symbol: string;
        Ask: string;
        AverageDailyVolume: string;
        Bid: string;
        AskRealtime: null;
        BidRealtime: null;
        BookValue: string;
        Change_PercentChange: string;
        Change: string;
        Commission: null;
        Currency: 'USD';
        ChangeRealtime: null;
        AfterHoursChangeRealtime: null;
        DividendShare: string;              // Dividend per share
        LastTradeDate: string;              // MM/DD/YYY
        TradeDate: null;
        EarningsShare: string;              // Earnings per share
        EPSEstimatedCurrentYear: string;
        EPSEstimatedNextYear: string;
        EPSEstimatedNextQuarter: string;
        DaysLow: string;
        DaysHigh: string;
        YearLow: string;
        YearHigh: string;
        HoldingsGainPercent: null;
        AnnualizedGain: null;
        HoldingsGain: null;
        HoldingsGainPercentRealtime: null;
        HoldingsGainRealtime: null;
        MoreInfo: null;
        OrderBookRealtime: null;
        MarketCapitalization: string;
        MarketCapRealtime: null;
        EBITDA: string;
        ChangeFromYearLow: string;
        PercentChangeFromYearLow: string;
        LastTradeRealtimeWithTime: null;
        ChangePercentRealtime: null;
        ChangeFromYearHigh: string;
        PercentChangeFromYearHigh: string;
        LastTradeWithTime: string;
        LastTradePriceOnly: string;
        HighLimit: null;
        LowLimit: null;
        DaysRange: string;
        DaysRangeRealtime: null;
        FiftydayMovingAverage: string;
        ChangeFromTwoHundredMovingAverage: string;
        PercentChangeFromTwoHundredMovingAverage: string;
        ChangeFromFiftydayMovingAverage: string;
        PercentChangeFromFiftydayMovingAverage: string;
        Name: string;
        Notes: null;
        Open: string;
        PreviousClose: string;
        PricePaid: null;
        ChangeinPercent: string;
        PriceSales: string;
        PriceBook: string;
        ExDividendDate: string;
        PERatio: string;
        DividendPayDate: string;
        PERatioRealtime: null;
        PEGRatio: string;
        PriceEPSEstimatedCurrentYear: string;
        PriceEPSEstimatedNextYear: string;
        Symbol: string;
        SharesOwned: null;
        ShortRatio: string;
        LastTradeTime: string;
        TickerTrend: null;
        OneyrTargetPrice: string;
        Volume: string;
        HoldingsValue: null;
        HoldingsValueRealtime: string;
        YearRange: string;
        DaysValueChange: null;
        DaysValueChangeRealtime: null;
        StockExchange: string;
        DividendYield: string;
        PercentChange: string;
    }

}


export default YahooAPI;