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

    export function HasFile(path: string): Promise<boolean> {
        return new Promise<boolean>((resolve: Function, reject: Function) => {
            FileSystem.ReadFile(path).then((data: string) => {
                resolve(true);
            }, (err: NodeJS.ErrnoException) => {
                resolve(false);
            });
        });
    }



    export function ReadDir(dir: string): Promise<string[]> {
        return new Promise<string[]>((resolve: Function, reject: Function) => {
            fs.readdir(dir, function (err: NodeJS.ErrnoException, files: string[]) {
                if (err) {
                    reject(err);
                }
                else {
                    resolve(files);
                }
            });
        });
    }

    export function MakeDir(dir: string) {
        return new Promise<void>((resolve: Function , reject: Function) => {
            fs.mkdir(dir, (err?: NodeJS.ErrnoException) => {
                if (err) {
                    reject(err);
                }
                else {
                    resolve();
                }
            });
        });
    }
    export function TryMakeDir(dir: string) {
        // The difference between MakeDir and TryMakeDir is that the latter
        // resolves sucessfully whether the directory was created or already the directory already exists.
        // MakeDir will throw an exception if you try to create a directory that already exists.
        // TryMakeDir is idempotent.
        return new Promise<void>((resolve: Function, reject: Function) => {
            let mk = MakeDir(dir);
            mk = mk.then(() => {
                resolve();
            });
            mk = mk.then(null, () => {
                resolve();
            });
        });
    }

    export function FileStats(path: string) {
        return new Promise<fs.Stats>((resolve: Function, reject: Function) => {
            fs.stat(path, (err: NodeJS.ErrnoException, stats: fs.Stats) => {
                if (err) {
                    reject(err);
                }
                else {
                    resolve(stats);
                }
            });
        });
    }

    export function PathAccess(path: string) {
        return new Promise<void>((resolve: Function, reject: Function) => {
            fs.access(path, fs.F_OK, (err: NodeJS.ErrnoException) => {
                if (err) {
                    reject(err);
                }
                else {
                    resolve();
                }
            });
        });
    }


}

export default FileSystem;

