import { supabase } from '../lib/supabase'
import { localRepo } from './repo.local'
import { supabaseRepo } from './repo.supabase'

// One interface (list/create/update/remove/uploadImage/auth), two backends.
export const repo = supabase ? supabaseRepo : localRepo
