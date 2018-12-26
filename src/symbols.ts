import path = require('path');
import API from './api/api';
import fs from './utilities/filesystem';
import DateTime from './utilities/datetime';

// Get the latest symbol lists from ftp://ftp.nasdaqtrader.com/SymbolDirectory/
// The files are as follows
// 1. nasdaqlisted.txt - list of equities trading on the NASDAQ
// 2. otherlisted.txt - list of equities trading on other exchanges
// 3. mfundslist.txt - list of mutual funds
// 4. otclist.txt - list of over the counter traded equities
// More information can be found here http://www.nasdaqtrader.com/trader.aspx?id=symboldirdefs
// Symbology!


module ExchangeAPI {


    export function WriteSymbolLists(outDir: string) {
        let nasdaq = GetNasdaqListed();
        let others = GetOtherListed();
        let mutualfunds = GetMutualFundsListed();
        let otc = GetOtherListed();

        return Promise.all([nasdaq, others, mutualfunds, otc]).then((data: string[]) => {
            let date = DateTime.format(new Date(), 'yyyy-MM-dd');

            let nasdaq = path.join(outDir, `nasdaqlisted-${date}.txt`);
            let others = path.join(outDir, `otherlisted-${date}.txt`);
            let mutualfunds = path.join(outDir, `mfundslist-${date}.txt`);
            let otc = path.join(outDir, `otclist-${date}.txt`);

            return Promise.all([
                fs.WriteFile(nasdaq, data[0]),
                fs.WriteFile(others, data[1]),
                fs.WriteFile(mutualfunds, data[2]),
                fs.WriteFile(otc, data[3])
            ]);
        });
    }


    export function GetNasdaqListed() {
        // TODO: use ftp protocol
        // TODO: parse body?
        return API.Get(`ftp://ftp.nasdaqtrader.com/SymbolDirectory/nasdaqlisted.txt`);
    }
    export function GetOtherListed() {
        return API.Get('ftp://ftp.nasdaqtrader.com/SymbolDirectory/otherlisted.txt');
    }
    export function GetMutualFundsListed() {
        return API.Get('ftp://ftp.nasdaqtrader.com/SymbolDirectory/mfundslist.txt');
    }
    export function GetOTCListed() {
        return API.Get('ftp://ftp.nasdaqtrader.com/SymbolDirectory/otclist.txt');
    }

}

export default ExchangeAPI;

