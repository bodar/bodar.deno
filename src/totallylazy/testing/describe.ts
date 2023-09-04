export type It = (name: string, fn: (context: Deno.TestContext) => void | Promise<void>) => Promise<void>;

export function describe(suite: string, outer: (it: It) => Promise<void>) {
    Deno.test(suite, async (context) => {
        await outer(async (test, inner) => {
            await context.step(test, inner)
        });
    });
}

