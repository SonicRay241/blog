import { createClient } from "@supabase/supabase-js";

export const supabase = createClient(process.env.SUPA_URL!, process.env.SUPA_KEY!)