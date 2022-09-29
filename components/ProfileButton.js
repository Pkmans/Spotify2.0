import React, {Fragment} from "react";
import { signOut, useSession } from "next-auth/react";
import { Menu, Transition } from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/outline/esm";



function ProfileButton() {
  const { data: session } = useSession();

  function classNames(...classes) {
    return classes.filter(Boolean).join(" ");
  }

  return (
    <header className="profile-button absolute top-9 right-9">
      <Menu as="div" className="relative inline-block text-left">
        <div>
          <Menu.Button
            className="menu-button flex items-center space-x-3 bg-gray-900 text-white 
              opacity-[90%] hover:opacity-100 cursor-pointer rounded-full p-1 pr-2"
          >
            <img className="rounded-full w-10 h-10" src={session?.user.image} />
            <h2 className="username">{session?.user.name}</h2>
            <ChevronDownIcon className="icon w-5 h-5" />
          </Menu.Button>
        </div>

        <Transition
          as={Fragment}
          enter="transition ease-out duration-100"
          enterFrom="transform opacity-0 scale-95"
          enterTo="transform opacity-100 scale-100"
          leave="transition ease-in duration-75"
          leaveFrom="transform opacity-100 scale-100"
          leaveTo="transform opacity-0 scale-95"
        >
          <Menu.Items
            className="absolute right-0 z-10 mt-2 w-44 origin-top-rightrounded-md rounded-md
             bg-gray-900 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
          >
            <div className="p-1">
              <Menu.Item>
                {({ active }) => (
                  <a
                    className={classNames(
                      active && "bg-gray-700",
                      "text-white block px-4 py-2 text-sm"
                    )}
                  >
                    Account
                  </a>
                )}
              </Menu.Item>
              <div className="divide-y divide-gray-700">
                <Menu.Item>
                  {({ active }) => (
                    <a
                      className={classNames(
                        active && "bg-gray-700",
                        "text-white block px-4 py-2 text-sm"
                      )}
                    >
                      Profile
                    </a>
                  )}
                </Menu.Item>
                <Menu.Item>
                  {({ active }) => (
                    <a
                      onClick={signOut}
                      className={classNames(
                        active && "bg-gray-700",
                        "text-white block px-4 py-2 text-sm"
                      )}
                    >
                      Log Out
                    </a>
                  )}
                </Menu.Item>
              </div>
            </div>
          </Menu.Items>
        </Transition>
      </Menu>
    </header>
  );
}

export default ProfileButton;
