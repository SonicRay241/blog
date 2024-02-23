"use server"

import { Database } from "@/libs/database.types"
import { createClient } from "@supabase/supabase-js"

const createFetch =
    (options: Pick<RequestInit, "next" | "cache">) =>
    (url: RequestInfo | URL, init?: RequestInit) => {
        return fetch(url, {
            ...init,
            ...options,
    });
};

const supabase = createClient<Database>(process.env.SUPA_URL!, process.env.SUPA_KEY!, {global: {fetch: createFetch({cache: "no-store"})}})

export async function testAction(formData: FormData) {
    "use server"
    const { error } = await supabase.from("blogs").insert({id: "test3", title: "amongus", content: "amongusss"})
    if (error) console.log(error.message)
}

export async function read() {
    "use server"
    const pageRange = 10
    
    const { error: countError, count } = await supabase.from("blogs").select("*", {count: "exact", head: true})
    if (countError) return console.log(countError.message)
    const { data, error } = await supabase.from("blogs").select().range(0, pageRange)
    if (error) return console.log(error.message)

    return { data: data, count: count }
}