
namespace CSV {

    const COMMA_DELIM = /(?:\s)*,(?:\s)*/g;

    export function Parse(data: string, header?: string) {
        let lines = data.trim().split(/\s/);

        let head: string[];
        if (header) {
            head = header.split(COMMA_DELIM);
        }
        else {
            head = lines.shift().split(COMMA_DELIM);
        }

        let objs: any[] = [];

        for (let line of lines) {
            let obj: any = {};

            let parts = line.split(COMMA_DELIM);

            for (let i = 0; i < head.length; i++) {
                let title = head[i];
                let part = parts[i];

                obj[title] = part;
            }
            objs.push(obj);
        }
        return objs;
    }

}

export default CSV;