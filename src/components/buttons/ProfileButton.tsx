import { useAppDispatch } from "@/app/hook";
import { setEditMode } from "@/features/user/userSlice";
import { trpc } from "@/utils/trpc";
import { Menu, Transition } from "@headlessui/react";
import { signOut, useSession } from "next-auth/react";
import Image from "next/image";
import { Fragment } from "react";
import { LogOut, Settings } from "react-feather";

export default function ProfileButton() {
  const dispatch = useAppDispatch();
  const { data } = useSession();
  const userImage = data?.user?.image as string;
  const useAlt = data?.user?.name as string;

  const { mutate } = trpc.useMutation(["logs.time-out"], {
    onSuccess: async () => {
      await signOut();
    },
  });

  const isPatient = data?.user?.role === "PATIENT";

  const signOutClick = async () => {
    if (window.confirm("Are you sure logout?")) {
      if (isPatient) {
        await signOut();
      } else {
        mutate();
      }
    }
  };

  return (
    <Menu as="div" className="relative inline-block text-left">
      <Menu.Button className="flex items-center gap-5">
        <h1 className="capitalize text-gray-900 text-base font-bold">
          {data?.user?.name}
        </h1>
        <span className="inline-block h-10 w-10 overflow-hidden rounded-full bg-gray-100 border border-gray-500">
          {data?.user && (
            <>
              {userImage ? (
                <Image width={48} height={48} src={userImage} alt={useAlt} />
              ) : (
                <Image width={48} height={48} src="/user.svg" alt="user" />
              )}
            </>
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
          <div className="p-2">
            {!isPatient ? (
              <>
                <Menu.Item>
                  <button
                    type="submit"
                    className="text-gray-700 w-full px-4 py-2 text-left text-sm hover:bg-green-100 flex gap-2"
                    onClick={() => {
                      if (data?.user) {
                        dispatch(
                          setEditMode({
                            edit: true,
                            id: data?.user?.id as unknown as number,
                          })
                        );
                      }
                    }}
                  >
                    <Settings size={20} />
                    Account Settings
                  </button>
                </Menu.Item>
                <div className="w-full border-b-2 border-gray-600 my-2" />
              </>
            ) : null}
            <Menu.Item>
              <button
                type="submit"
                className="text-gray-700 flex gap-2 w-full px-4 py-2 text-left text-sm hover:bg-green-100"
                onClick={signOutClick}
              >
                <LogOut size={20} />
                Sign out
              </button>
            </Menu.Item>
          </div>
        </Menu.Items>
      </Transition>
    </Menu>
  );
}
