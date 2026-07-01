"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { 
  LayoutDashboard, 
  History, 
  User, 
  Activity,
  Shield,
  Stethoscope
} from "lucide-react"

const BRAND_PRIMARY = "#22668A"

interface SidebarProps {
  role: "user" | "admin"
}

export default function Sidebar({ role }: SidebarProps) {
  const pathname = usePathname()

  const userMenuItems = [
    {
      href: "/user",
      label: "Dashboard",
      icon: LayoutDashboard,
    },
    {
      href: "/user/gejala",
      label: "Gejala",
      icon: Stethoscope,
    },
    {
      href: "/user/history",
      label: "Riwayat",
      icon: History,
    },
    {
      href: "/user/profile",
      label: "Profil",
      icon: User,
    },
  ]

  const adminMenuItems = [
    {
      href: "/admin",
      label: "Dashboard",
      icon: LayoutDashboard,
    },
    {
      href: "/admin/profile",
      label: "Profil",
      icon: User,
    },
  ]

  const menuItems = role === "admin" ? adminMenuItems : userMenuItems

  return (
    <aside className="w-64 bg-white border-r border-gray-200 min-h-screen">
      {/* Logo */}
      <div className="p-6 border-b border-gray-200">
        <Link href="/" className="flex items-center gap-2">
          <Activity className="h-6 w-6" style={{ color: BRAND_PRIMARY }} />
          <span className="font-bold text-xl" style={{ color: BRAND_PRIMARY }}>
            Symptom Checker AI
          </span>
        </Link>
      </div>

      {/* Navigation Menu */}
      <nav className="p-4 space-y-1">
        {menuItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                isActive
                  ? "bg-blue-50 text-blue-700"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
              style={isActive ? { backgroundColor: `${BRAND_PRIMARY}15`, color: BRAND_PRIMARY } : {}}
            >
              <Icon className="h-5 w-5" />
              {item.label}
            </Link>
          )
        })}
      </nav>

      {/* Role Badge */}
      <div className="absolute bottom-4 left-4 right-4">
        <div className="flex items-center gap-2 px-4 py-3 bg-gray-50 rounded-lg">
          {role === "admin" ? (
            <>
              <Shield className="h-4 w-4 text-red-600" />
              <span className="text-sm font-medium text-gray-700">Administrator</span>
            </>
          ) : (
            <>
              <User className="h-4 w-4 text-blue-600" />
              <span className="text-sm font-medium text-gray-700">User</span>
            </>
          )}
        </div>
      </div>
    </aside>
  )
}