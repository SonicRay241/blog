import { Fetcher } from "swr"

export const fetcherJSON: Fetcher<any, string> = (...args) => fetch(...args).then(res => res.json())
export const fetcherText: Fetcher<any, string> = (...args) => fetch(...args).then(res => res.text())