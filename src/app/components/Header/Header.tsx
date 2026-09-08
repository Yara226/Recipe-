
import Link from 'next/link';
import {FaRegBookmark, FaHome, FaBell, FaUser, FaPlus } from 'react-icons/fa';

export default function Header() {
  return (
    <>
    <div className="z-50 mt-2 bg-white border-t border-gray-100 px-6 py-3 flex justify-between items-center shadow-lg  m-auto w-100 max-w-md fixed bottom-0 left-0 right-0">
       <Link href={'/home'}>
        <button className="text-[#129575]">
          <FaHome className="w-6 h-6" />
        </button></Link>
       <Link href={'./saved'}>
        <button className="text-gray-300 hover:text-gray-500">
          <FaRegBookmark className="w-6 h-6" />
        </button>
       </Link>
      
    
      <Link href={"./adding"}>
        <button className="bg-[#129575] hover:bg-[#0f7a5f] text-white w-12 h-12 rounded-full flex items-center justify-center shadow-md -mt-8 border-4 border-white">
          <FaPlus className="w-5 h-5" />
        </button>
      </Link>
            <Link href={"/notifications"}>
        <button className="text-gray-300 hover:text-gray-500">
          <FaBell className="w-6 h-6" />
        </button>
        </Link>
        <Link href={"/profile"}>
        <button className="text-gray-300 hover:text-gray-500">
          <FaUser className="w-6 h-6" />
        </button>
        </Link>
      </div>
    </>
  )
}
