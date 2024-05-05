import {QueryOptions} from "postgres/query/query.ts";
import {encodeHex} from "std/encoding/hex.ts";
import {Sql} from "../template/Sql.ts";
import {statement} from "./statement.ts";

async function hashSHA256(value: string): Promise<string> {
    const data = new TextEncoder().encode(value);
    const hash = await crypto.subtle.digest("SHA-256", data);
    return encodeHex(hash);
}

export async function prepareStatement(sql: Sql, name?: string): Promise<QueryOptions> {
    const {text, args} = statement(sql);
    return {
        name: (name ?? await hashSHA256(text)).slice(0, 63),
        text,
        args
    }
}

