import { useAppDispatch, useAppSelector } from "@/app/hook";
import OutlinedButton from "@/components/buttons/OutlinedButton";
import PrimaryButton from "@/components/buttons/PrimaryButton";
import GenericInput from "@/components/inputs/GenericInput";
import PhysicianInput from "@/components/inputs/PhysicianInput";
import { ChangePasswordInput, UpdateUserInput } from "@/schema/user.schema";
import { trpc } from "@/utils/trpc";
import { Dialog, Tab, Transition } from "@headlessui/react";
import { Physician, Role, User } from "@prisma/client";
import { NextPage } from "next";
import { useSession } from "next-auth/react";
import React, { Fragment, useEffect } from "react";
import { XSquare } from "react-feather";
import { useForm } from "react-hook-form";
import EditUser from "../users/EditUser";
import { setAccountMode } from "../users/usersSlice";
import { setEditMode, userState } from "./userSlice";

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

const UpdateUser: NextPage = () => {
  const { data } = useSession();
  const dispatch = useAppDispatch();
  const { edit } = useAppSelector(userState);

  const handleCloseModal = () => {
    dispatch(setEditMode({ edit: false }));
  };

  const userData = trpc.useQuery(["users.me"]);
  useEffect(() => {
    if (userData) {
      dispatch(
        setAccountMode({
          account: true,
          user: userData?.data as
            | (User & { Physician: Physician | null })
            | undefined,
        })
      );
    }
  }, [dispatch, userData]);

  const { handleSubmit, register, reset } = useForm<ChangePasswordInput>();
  const { mutate, error, isLoading, isSuccess } = trpc.useMutation(
    ["users.change-password"],
    {
      onSuccess: () => {
        reset();
      },
    }
  );
  function onSubmit(values: ChangePasswordInput) {
    mutate({ ...values });
  }
  return (
    <>
      <Transition
        appear
        show={edit && data?.user?.role !== Role.ADMIN}
        as={Fragment}
      >
        <Dialog as="div" className="relative" onClose={handleCloseModal}>
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
                    <OutlinedButton onClick={handleCloseModal}>
                      <XSquare size={24} />
                    </OutlinedButton>
                  </Dialog.Title>
                  <Tab.Group>
                    <div className="flex items-center flex-col">
                      <div className="container  w-full">
                        <Tab.List className=" flex space-x-1 rounded-xl bg-green-900/20 p-1 w-3/6 my-5 ">
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
                      <Tab.Panels className={"container"}>
                        <Tab.Panel>
                          <EditUser />
                        </Tab.Panel>
                        <Tab.Panel>
                          <div
                            className={`"relative shadow-md sm:rounded-lg mx-5 p-5 overflow-hidden h-full"`}
                          >
                            {error && (
                              <div
                                className="flex p-4 mb-4 text-sm text-red-700 bg-red-100 rounded-lg dark:bg-red-200 dark:text-red-800"
                                role="alert"
                              >
                                <span className="font-medium">
                                  Error alert!
                                </span>{" "}
                                {error && error.message}
                              </div>
                            )}
                            {isSuccess && (
                              <div
                                className="p-4 mb-4 text-sm text-green-700 bg-green-100 rounded-lg dark:bg-green-200 dark:text-green-800"
                                role="alert"
                              >
                                <span className="font-medium">
                                  Success alert!
                                </span>{" "}
                                Password Updated
                              </div>
                            )}
                            <form
                              onSubmit={handleSubmit(onSubmit)}
                              className="h-[368px] flex flex-col justify-between"
                            >
                              <div className="md:grid md:grid-cols-2 md:gap-6">
                                <div className="col-span-1 space-y-3">
                                  <GenericInput
                                    label="Old Password"
                                    type="password"
                                    placeHolder="Old Password"
                                    required
                                    register={register("oldPassword")}
                                  />
                                  <GenericInput
                                    label="New Password"
                                    type="password"
                                    placeHolder="New Password"
                                    required
                                    register={register("newPassword")}
                                  />
                                  <GenericInput
                                    label="Confirm Password"
                                    type="password"
                                    placeHolder="Confirm Password"
                                    required
                                    register={register("confirmPassword")}
                                  />
                                </div>
                                <div className="col-span-1 space-y-3"></div>
                              </div>
                              <div className="w-full">
                                <div className="py-3 text-right">
                                  <PrimaryButton
                                    className="w-1/3"
                                    type="submit"
                                    isLoading={isLoading}
                                  >
                                    Update
                                  </PrimaryButton>
                                </div>
                              </div>
                            </form>
                          </div>
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
