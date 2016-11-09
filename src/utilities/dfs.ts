

export function DFS(doc: Node, each: (node: Node) => void) {
    let discovered: Node[] = [];

    let start: Node[] = [];
    start.push(doc);
    while (start.length > 0) {
        let node = start.pop();

        if (discovered.indexOf(node) === -1) {
            discovered.push(node);

            // do anything important with this node here
            each(node);

            if (node.hasChildNodes()) {
                for (let i = 0; i < node.childNodes.length; i++) {
                    let child = node.childNodes.item(i);
                    start.push(child);
                }   
            }
        }
    }
}

export default DFS;