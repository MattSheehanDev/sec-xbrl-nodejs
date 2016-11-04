import fs = require('fs');



module FileSystem {


    export function WriteFile(path: string, data: string): Promise<void> {
        return new Promise<void>((resolve: Function, reject: Function) => {
            fs.writeFile(path, data, (err: NodeJS.ErrnoException) => {
                if (err) reject(err);
                else resolve();
            });
        });
    }

    export function ReadFile(path: string): Promise<string> {
        return new Promise<string>((resolve: Function, reject: Function) => {
            fs.readFile(path, (err: NodeJS.ErrnoException, data: Buffer | string) => {
                if (err) {
                    reject(err);
                }
                else {
                    if (Buffer.isBuffer(data)) {
                        resolve(data.toString());
                    }
                    else {
                        resolve(data);
                    }
                }
            });
        });
    }

    export function HasFile(path: string) {
        return new Promise<boolean>((resolve: Function, reject: Function) => {
            FileSystem.ReadFile(path).then((data: string) => {
                resolve(true);
            }, (err: NodeJS.ErrnoException) => {
                resolve(false);
            });
        });
    }

}

export default FileSystem;

