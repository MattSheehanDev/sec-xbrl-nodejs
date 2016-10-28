import request = require('request');


namespace API {


    export function Get(uri: string) {
        return new Promise<any>((resolve: Function, reject: Function) => {
            request(uri, (err: any, response: any, body: any) => {
                if (err) reject(err);
                else resolve(body);
            });
        });
    }

}

export default API;