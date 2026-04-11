'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function Navbar() {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="w-full px-6 md:px-10 py-4 flex justify-between items-center bg-transparent text-white">
      {/* Logo */}
      <h1
        className="text-2xl font-bold text-blue-500 cursor-pointer"
        onClick={() => router.push('/')}
      >
        CRM Pro
      </h1>

      {/* Desktop Menu */}
      <div className="hidden md:flex space-x-4">
        <button
          onClick={() => router.push('/auth/login')}
          className="px-4 py-2 border border-blue-400 text-blue-400 rounded hover:bg-blue-900 transition"
        >
          Login
        </button>

        <button
          onClick={() => router.push('/auth/register')}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
        >
          Register
        </button>
      </div>

      {/* Mobile Menu Button */}
      <button className="md:hidden text-2xl" onClick={() => setIsOpen(!isOpen)}>
        ☰
      </button>

      {/* Mobile Dropdown */}
      {isOpen && (
        <div className="absolute top-16 right-6 bg-[#1e293b] p-6 rounded-xl shadow-lg flex flex-col space-y-4 md:hidden">
          <button
            onClick={() => {
              router.push('/login');
              setIsOpen(false);
            }}
            className="px-4 py-2 border border-blue-400 text-blue-400 rounded hover:bg-blue-900"
          >
            Login
          </button>

          <button
            onClick={() => {
              router.push('/register');
              setIsOpen(false);
            }}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Register
          </button>
        </div>
      )}
    </nav>
  );
}
