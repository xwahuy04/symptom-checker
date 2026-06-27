// src/app/(dashboard)/user/page.tsx
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

// Server Action untuk logout
async function logoutAction() {
  'use server'
  
  const supabase = await createClient()
  await supabase.auth.signOut()
  redirect('/login')
}

export default async function UserDashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return redirect('/login')
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <h1 className="text-2xl font-bold mb-2">Dashboard User</h1>
      <p className="text-gray-600 mb-6">Selamat datang, {user.email}</p>

      {/* Form dengan Server Action */}
      <form action={logoutAction}>
        <button
          type="submit"
          className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded"
        >
          Logout
        </button>
      </form>
    </div>
  )
}