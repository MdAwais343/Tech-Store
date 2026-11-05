import { useEffect, useState } from 'react'
import { repo } from '../../data/repo'
import AdminLogin from './AdminLogin.jsx'
import Dashboard from './Dashboard.jsx'
import './admin.css'

// The sign-in screen is a convenience only. Real protection is the row-level security in supabase/schema.sql,
// which rejects writes from anyone who is not an admin.
export default function AdminPage() {
  const [user, setUser] = useState(undefined) // undefined = still checking

  useEffect(() => {
    repo.auth.getUser().then(setUser)
    return repo.auth.onChange(setUser)
  }, [])

  if (user === undefined) return <div className="adm-center">Loading…</div>
  return user ? <Dashboard user={user} /> : <AdminLogin />
}
