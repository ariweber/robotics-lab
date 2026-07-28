import { createClient } from '@supabase/supabase-js'
import "dotenv/config"


const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
)

const reslut = await supabase.from("sessions").select()
console.log(reslut.data)
