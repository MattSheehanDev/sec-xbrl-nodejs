import API from './api';
import CSV from '../utilities/csv';


namespace YahooAPI {

    const YQL_URL = 'https://query.yahooapis.com/v1/public/yql';
    const YQL_FORMAT = 'json';
    const YQL_ENV = encodeURIComponent('http://datatables.org/alltables.env');
    // const YQL_ENV = `env=${encodeURIComponent('store://datatables.org/alltableswithkeys')}`;


    export function GetPrice(ticker: string|string[]): Promise<Result> {
        // yahoo.finance.quotes
        let symbols = `(${concatTickers(ticker)})`;
        let query = `select * from yahoo.finance.quotes where symbol in ${symbols}`;

        return Get(query);
    }

    export function GetHistoricalPrice(ticker: string|string[], startDate: string, endDate: string) {
        // yahoo.finance.historicaldata
        let symbols = `(${concatTickers(ticker)})`;
        let query = `select * from yahoo.finance.historicaldata where symbol in ${symbols}`;
        query += ` and startDate = "${startDate}" and endDate = "${endDate}"`;

        return Get(query);
    }


    function Get(query: string) {
        let component = `q=${encodeURIComponent(query)}&format=${YQL_FORMAT}&env=${YQL_ENV}`;
        let uri = `${YQL_URL}?${component}`;

        return API.Get(uri).then((value: string) => {
            return JSON.parse(value);
        });
    }

    function concatTickers(ticker: string|string[]) {
        if (Array.isArray(ticker)) {
            let s = ticker.map((t: string) => { `"${t}"` });
            return s.join(', ');
        }
        else {
            return `"${ticker}"`;
        }
    }



    export module csv {


        export function GetPrice(ticker: string|string[]): Promise<CSVResult[]> {
            let url = 'http://finance.yahoo.com/d/quotes.csv';
            let format = 'sabdyj1f6j2eb4p5p6rr5r6r7s7s6ghkj';

            let symbols: string;
            if (Array.isArray(ticker)) {
                symbols = ticker.join('+');
            }
            else {
                symbols = ticker;
            }

            let uri = `${url}?s=${symbols}&f=${format}`;

            return API.Get(uri).then((body: string) => {
                return Parse(body);
            });
        }


        function Parse(body: string) {
            // parse csv
            let header = 'Symbol,AskPrice,BidPrice,DividendPerShare,DividendYield,MarketCap,SharesFloat,SharesOutstanding,\
            EPS,EPSCurrentEst,EPSNextEst,BookValue,PriceToSales,PriceToBook,PERatio,PECurrentEst,PENextEst,PEGRatio,ShortRatio,\
            Revenue,DaysLow,DaysHigh,High52Week,Low52Week';
            let objs = CSV.Parse(body, header);

            let results: CSVResult[] = [];
            for (let obj of objs) {
                let askPrice = parseFloat(obj.AskPrice);
                let bidPrice = parseFloat(obj.BidPrice);
                let dividendPerShare = parseFloat(obj.DividendPerShare);
                let dividendYield = parseFloat(obj.DividendYield);
                let marketCap = parseFloat(obj.MarketCap);
                let sharesFloat = parseFloat(obj.SharesFloat);
                let sharesOutstanding = parseFloat(obj.SharesOutstanding);
                let eps = parseFloat(obj.EPS);
                let epsCurrentEst = parseFloat(obj.EPSCurrentEst);
                let epsNextEst = parseFloat(obj.EPSNextEst);
                let bookValue = parseFloat(obj.BookValue);
                let priceToSales = parseFloat(obj.PriceToSales);
                let priceToBook = parseFloat(obj.PriceToBook);
                let peRatio = parseFloat(obj.PERatio);
                let peCurrentEst = parseFloat(obj.PECurrentEst);
                let peNextEst = parseFloat(obj.PENextEst);
                let pegRatio = parseFloat(obj.PEGRatio);
                let shortRatio = parseFloat(obj.ShortRatio);
                let revenue = parseFloat(obj.Revenue);
                let daysLow = parseFloat(obj.DaysLow);
                let daysHigh = parseFloat(obj.DaysHigh);
                let high52Week = parseFloat(obj.High52Week);
                let low52Week = parseFloat(obj.Low52Week); 

                let result: CSVResult = {
                    Symbol: obj.Symbol.replace(/"/g, ''),
                    AskPrice: !isNaN(askPrice) ? askPrice : null,
                    BidPrice: !isNaN(bidPrice) ? bidPrice : null,
                    DividendPerShare: !isNaN(dividendPerShare) ? dividendPerShare : null,
                    DividendYield: !isNaN(dividendYield) ? dividendYield : null,
                    MarketCap: !isNaN(marketCap) ? marketCap : null,
                    SharesFloat: !isNaN(sharesFloat) ? sharesFloat : null,
                    SharesOutstanding: !isNaN(sharesOutstanding) ? sharesOutstanding : null,
                    EPS: !isNaN(eps) ? eps : null,
                    EPSCurrentEst: !isNaN(epsCurrentEst) ? epsCurrentEst : null,
                    EPSNextEst: !isNaN(epsNextEst) ? epsNextEst : null,
                    BookValue: !isNaN(bookValue) ? bookValue : null,
                    PriceToSales: !isNaN(priceToSales) ? priceToSales : null,
                    PriceToBook: !isNaN(priceToBook) ? priceToBook : null,
                    PERatio: !isNaN(peRatio) ? peRatio : null,
                    PECurrentEst: !isNaN(peCurrentEst) ? peCurrentEst : null,
                    PENextEst: !isNaN(peNextEst) ? peNextEst : null,
                    PEGRatio: !isNaN(pegRatio) ? pegRatio : null,
                    ShortRatio: !isNaN(shortRatio) ? shortRatio : null,
                    Revenue: !isNaN(revenue) ? revenue : null,
                    DaysLow: !isNaN(daysLow) ? daysLow : null,
                    DaysHigh: !isNaN(daysHigh) ? daysHigh : null,
                    High52Week: !isNaN(high52Week) ? high52Week : null,
                    Low52Week: !isNaN(low52Week) ? low52Week : null
                }
                results.push(result);
            }
            return results;
        }


    }




    // Symbol,AskPrice,BidPrice,DividendPerShare,DividendYield,MarketCap,SharesFloat,SharesOutstanding,EPS,EPSCurrentEst,EPSNextEst,
    // BookValue,PriceToSales,PriceToBook,PERatio,PECurrentEst,PENextEst,PEGRatio,ShortRatio,Revenue,DaysLow,DaysHigh,High52Week,Low52Week
    // sabdyj1f6j2eb4p5p6rr5r6r7s7s6ghkj
    export interface CSVResult {
        Symbol: string;                 // s
        AskPrice: number;               // a
        BidPrice: number;               // b    (not sure what bid price is??)
        DividendPerShare: number;       // d
        DividendYield: number;          // y
        MarketCap: number;              // j1
        SharesFloat: number;            // f6   (shares that are counted twice??)
        SharesOutstanding: number;      // j2
        EPS: number;                    // e    (earnings per share)
        EPSCurrentEst: number;          // e8   (earnings per share current year estimate)
        EPSNextEst: number;             // e9   (earnings per share next year estimate)
        BookValue: number;              // b4
        PriceToSales: number;           // p5
        PriceToBook: number;            // p6
        PERatio: number;                // r
        PECurrentEst: number;           // r6   (P/E current year estimate)
        PENextEst: number;              // r7   (P/E next year estimate)
        PEGRatio: number;               // r5
        ShortRatio: number;             // s7
        Revenue: number;                // s6
        DaysLow: number;                // g
        DaysHigh: number;               // h
        High52Week: number;             // k
        Low52Week: number;              // j
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