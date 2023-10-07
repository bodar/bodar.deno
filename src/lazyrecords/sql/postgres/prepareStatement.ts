import {QueryOptions} from "https://deno.land/x/postgres@v0.17.0/query/query.ts";
import {encodeHex} from "https://deno.land/std@0.203.0/encoding/hex.ts";
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

