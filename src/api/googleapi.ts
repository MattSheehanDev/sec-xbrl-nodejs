import path = require('path');
import fs from '../utilities/filesystem';


namespace GoogleAPI {


    export function GetGPrice() {
        return new Promise<any>((resolve: Function, reject: Function) => {
            let root = 'https://www.google.com/finance/info';
            let query = 'NSE%3AAIAENG%2CATULAUTO';
            let d = decodeURIComponent('https://www.google.com/finance/info?q=NSE%3AAIAENG%2CATULAUTO');

            let uri = `${root}?q=${query}`;

            fs.ReadFile(path.join(process.cwd(), 'test/googlefinance.json')).then((body: string) => {

                let match = body.match(/(?:\s)*\/\/(?:\s)*/i);
                if (match.length > 0) {
                    let first = match[0];
                    body = body.substring(first.length);
                }

                let result = JSON.parse(body);
                resolve(result);

            }, (err: any) => {

                reject(err);

            });

        //     API.Get(uri).then((value: string) => {

        //         let result = JSON.parse(value);
        //         resolve(result);

        //     }, (err: any) => {
        //         reject(err);
        //     });
        });
    }

}