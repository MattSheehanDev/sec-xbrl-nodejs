import path = require('path');
import nunjucks = require('nunjucks');
import fs from './filesystem';


export default function RenderTemplates(data: any) {
    console.log('rendering templates');
    return renderNunjucks(
        path.join(process.cwd(), './templates/index.html'),
        ['.', './templates/'],
        data
    );
}
function renderNunjucks(inputFilePath: string, searchRelativePaths: string[], context: any): Promise<string> {
    let read = fs.ReadFile(inputFilePath);
    read = read.then((data: string) => {
        let env = nunjucks.configure(searchRelativePaths, {
            autoescape: true,
            trimBlocks: false,
            lstripBlocks: false
        });

        return new Promise<string>((resolve: Function, reject: Function) => {
            env.renderString(data, context, (err: any, res: string) => {
                if (err) {
                    reject(err);
                }
                else {
                    resolve(res);
                }
            });
        });
    });
    return read;
}
