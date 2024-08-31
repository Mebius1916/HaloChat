"use client"
import Link from 'next/link'
import Image from 'next/image'
import logoImage from '../public/assets/logo.png'
import { usePathname } from 'next/navigation'
import { Logout } from '@mui/icons-material'
import { signOut, useSession } from 'next-auth/react'
import { SessionData } from '@/lib/type'
const handleLogout = () => {
  signOut({ callbackUrl: '/' });
}
const TopBar = () => {
  const { data: session } = useSession();
  const user = session?.user as SessionData;
  const pathname = usePathname();
  return (
    <div className="top-0 sticky px-10 py-5 flex 
    items-center justify-between bg-blue-2">
      <Link href="/chats">
        <Image
          src={logoImage}
          alt='logo'
          width={1000}
          height={1000}
          priority
          className='w-52 h-auto'
        />
      </Link>
      <div className="flex items-center gap-8 max-sm:hidden">
        <Link
          href="/chats"
          className={`${pathname === "/chats" ? "text-red-1" : ""} text-heading4-bold`}
        >
          Chats
        </Link>
        <Link href="/contacts"
          className={`${pathname === "/contacts" ? "text-red-1" : ""} text-heading4-bold`}>
          Contacts
        </Link>
        <Logout sx={{ color: "#737373", cursor: "pointer" }} onClick={handleLogout} />
        <Link rel="stylesheet" href="/profile">
          <img
            src={user?.profileImage || "/assets/person.jpg"}
            alt="profile"
            className="profilePhoto"
          />
        </Link>
      </div>
    </div>
  )
}

export default TopBar