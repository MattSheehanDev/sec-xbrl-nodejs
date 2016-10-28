
declare var xbrl: {
    parseFile(path: string): Promise<any>;
    parseStr(str: string): Promise<any>;    
};

declare module 'parse-xbrl' {
    export = xbrl;
}