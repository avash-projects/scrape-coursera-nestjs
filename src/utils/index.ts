import { Parser } from '@json2csv/plainjs';
import * as fs from "fs";
import { IJSON } from "./dto";
import { join } from 'path';

export const json2csv = (data: IJSON[],query: string) => {
    try {
        const opts = {};
        const parser = new Parser(opts);
        const csv = parser.parse(data);
        fs.writeFileSync(join(__dirname, '../..', 'public',`scrape-${query}-${(new Date()).getTime()}.csv`),csv);
    } catch (err) {
        console.error(err);
    }
}