import { cn } from '@/lib/utils'
import Image from 'next/image'
import Link from 'next/link'

const Header = ({ children, className }: HeaderProps) => {
  return (
    <div className={cn("min-h-20 min-w-full flex-nowrap bg-blue-800 flex w-full items-center justify-between gap-2 px-4", className)}>
      <Link href='/' className="flex items-center md:flex-1">
        <Image 
          src="/logo-1.png"
          alt="Logo with name"
          width={60}
          height={32}
          className="hidden md:block p-1"
        />
        <Image 
          src="/logo-1.png"
          alt="Logo"
          width={32}
          height={32}
          className="mr-2 md:hidden"
        />
        <span className='uppercase font-extrabold text-2xl'>JRooms</span>
      </Link>
      {children}
    </div>
  )
}

export default Header