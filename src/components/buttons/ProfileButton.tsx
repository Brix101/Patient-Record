import { trpc } from "@/utils/trpc";
import { Menu, Transition } from "@headlessui/react";
import { signOut, useSession } from "next-auth/react";
import Image from "next/image";
import { Fragment } from "react";

export default function ProfileButton() {
  const { data } = useSession();
  const userImage = data?.user?.image as string;
  const useAlt = data?.user?.name as string;

  const { mutate } = trpc.useMutation(["logs.time-out"]);

  return (
    <Menu as="div" className="relative inline-block text-left">
      <Menu.Button className="flex items-center">
        <span className="inline-block h-10 w-10 overflow-hidden rounded-full bg-gray-100 border border-gray-500">
          {data?.user && (
            <Image width={48} height={48} src={userImage} alt={useAlt} />
          )}
        </span>
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
        <Menu.Items className="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
          <div className="py-1">
            <Menu.Item>
              <button
                type="submit"
                className="text-gray-700 block w-full px-4 py-2 text-left text-sm hover:bg-green-100"
                onClick={() => {
                  mutate();
                  signOut();
                }}
              >
                Sign out
              </button>
            </Menu.Item>
          </div>
        </Menu.Items>
      </Transition>
    </Menu>
  );
}
