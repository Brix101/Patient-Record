import { useAppDispatch, useAppSelector } from "@/app/hook";
import OutlinedButton from "@/components/buttons/OutlinedButton";
import { Dialog, Tab, Transition } from "@headlessui/react";
import { NextPage } from "next";
import { useSession } from "next-auth/react";
import dynamic from "next/dynamic";
import { Fragment } from "react";
import { XSquare } from "react-feather";
import { setEditMode, userState } from "./userSlice";

const PasswordForm = dynamic(() => import("./PasswordForm"), { ssr: false });
const PersonalForm = dynamic(() => import("./PersonalForm"), { ssr: false });

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

const UpdateUser: NextPage = () => {
  const dispatch = useAppDispatch();
  const { data } = useSession();
  const { edit } = useAppSelector(userState);

  const handleCloseModal = () => {
    dispatch(setEditMode({ edit: false }));
  };

  const isPatient = data?.user?.role === "PATIENT";

  return (
    <>
      <Transition appear show={edit} as={Fragment}>
        <Dialog as="div" className="relative z-50" onClose={handleCloseModal}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed bg-black bg-opacity-25" />
          </Transition.Child>

          <div className="fixed inset-0  overflow-hidden">
            <div className="flex min-h-full items-center justify-center text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full h-screen transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                  <Dialog.Title
                    as="h3"
                    className="text-lg font-medium leading-6 text-gray-900 flex justify-between items-center"
                  >
                    Account Settings
                    <div>
                      <OutlinedButton onClick={handleCloseModal}>
                        <XSquare size={24} />
                      </OutlinedButton>
                    </div>
                  </Dialog.Title>
                  <Tab.Group>
                    <div className="flex items-center flex-col">
                      <div className="container  w-full">
                        <Tab.List className=" flex space-x-1 rounded-xl bg-green-900/20 p-1 w-3/6 my-5 ">
                          {!isPatient ? (
                            <Tab
                              className={({ selected }) =>
                                classNames(
                                  "w-full rounded-lg py-2.5 text-sm font-medium leading-5 text-green-700",
                                  "ring-white ring-opacity-60 ring-offset-2 ring-offset-green-400 focus:outline-none focus:ring-2",
                                  selected
                                    ? "bg-white shadow"
                                    : "text-gray-900 hover:bg-white/[0.12] hover:text-gray-800"
                                )
                              }
                            >
                              Personal
                            </Tab>
                          ) : null}
                          <Tab
                            className={({ selected }) =>
                              classNames(
                                "w-full rounded-lg py-2.5 text-sm font-medium leading-5 text-green-700",
                                "ring-white ring-opacity-60 ring-offset-2 ring-offset-green-400 focus:outline-none focus:ring-2",
                                selected
                                  ? "bg-white shadow"
                                  : "text-gray-900 hover:bg-white/[0.12] hover:text-gray-800"
                              )
                            }
                          >
                            Password
                          </Tab>
                        </Tab.List>
                      </div>
                      <Tab.Panels
                        className={
                          "container h-[65vh] relative overflow-hidden"
                        }
                      >
                        {!isPatient ? (
                          <Tab.Panel
                            className={"h-full w-full overflow-y-auto"}
                          >
                            <PersonalForm />
                          </Tab.Panel>
                        ) : null}
                        <Tab.Panel className={"h-full w-full overflow-y-auto"}>
                          <PasswordForm />
                        </Tab.Panel>
                      </Tab.Panels>
                    </div>
                  </Tab.Group>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
};

export default UpdateUser;
