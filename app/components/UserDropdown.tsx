'use client';

import { Fragment } from 'react';
import { Menu, Transition } from '@headlessui/react';
import { User, LogOut } from 'lucide-react';
import { signOut } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import toast from 'react-hot-toast';
import md5 from 'md5';
import Image from 'next/image';
import { useAuth } from '@/lib/AuthContext';

export default function UserDropdown() {
  const { user } = useAuth();
  
  const handleSignOut = async () => {
    try {
      await signOut(auth);
      toast.success('Signed out successfully');
    } catch (error) {
      toast.error('Failed to sign out');
    }
  };

  if (!user) return null;

  const gravatarHash = md5(user.email?.toLowerCase() || '');
  const gravatarUrl = `https://www.gravatar.com/avatar/${gravatarHash}?d=mp&s=40`;
  const displayName = user.username || user.email?.split('@')[0] || 'User';

  return (
    <Menu as="div" className="relative inline-block text-left">
      <Menu.Button className="flex items-center gap-3 bg-white/10 rounded-full pl-1 pr-4 py-1 hover:bg-white/20 transition-colors">
        <Image
          src={gravatarUrl}
          alt="User avatar"
          width={32}
          height={32}
          className="rounded-full"
        />
        <span className="text-white font-medium">{displayName}</span>
      </Menu.Button>

      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Menu.Items className="absolute right-0 mt-2 w-56 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
          <div className="px-4 py-3">
            <p className="text-sm text-gray-900">Signed in as</p>
            <p className="truncate text-sm font-medium text-gray-900">{user.email}</p>
          </div>
          <div className="py-1">
            <Menu.Item>
              {({ active }) => (
                <button
                  onClick={handleSignOut}
                  className={`${
                    active ? 'bg-gray-100' : ''
                  } flex w-full items-center px-4 py-2 text-sm text-gray-700 gap-2`}
                >
                  <LogOut size={16} />
                  Sign Out
                </button>
              )}
            </Menu.Item>
          </div>
        </Menu.Items>
      </Transition>
    </Menu>
  );
}