import OutlinedButton from "@/components/buttons/OutlinedButton";
import PrimaryButton from "@/components/buttons/PrimaryButton";
import { UpdateAppointmentInput } from "@/schema/appointment.schema";
import { Dialog, TextField } from "@mui/material";
import { DateTimePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import {
  AppointmentStatus,
  MedicalRecord,
  Patient,
  Physician,
  Room,
  User,
} from "@prisma/client";
import { trpc } from "@utils/trpc";
import moment from "moment";
import type { NextPage } from "next";
import { useSession } from "next-auth/react";
import { useState } from "react";
import { Calendar, momentLocalizer, Views } from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { Trash2, XSquare } from "react-feather";
import { Controller, useForm } from "react-hook-form";
import Select from "react-select";

const localizer = momentLocalizer(moment);

const Apointment: NextPage = () => {
  const session = useSession();

  const isNurse = session.data?.user?.role === "NURSE";

  const {
    handleSubmit: handleUpdateSubmit,
    control: controlUpdate,
    reset: resetUpdate,
    formState: { isDirty: isUpdateDirty },
  } = useForm<UpdateAppointmentInput>();

  const [selectedAppointment, setSelectedAppointment] = useState<
    | {
        title: string;
        id: number;
        status: AppointmentStatus;
        start: Date | null;
        end: Date | null;
        physicianId: number;
        medicalRecordId: number | null;
        MedicalRecord:
          | (MedicalRecord & {
              room: Room | null;
              patient: Patient | null;
            })
          | null;
        physician: Physician & {
          user: User;
        };
      }
    | undefined
  >();

  const [appointments, setAppointments] = useState<
    | {
        title: string;
        id: number;
        status: AppointmentStatus;
        start: Date | null;
        end: Date | null;
        physicianId: number;
        medicalRecordId: number | null;
        MedicalRecord:
          | (MedicalRecord & {
              room: Room | null;
              patient: Patient | null;
            })
          | null;
        physician: Physician & {
          user: User;
        };
      }[]
    | undefined
  >();

  trpc.useQuery(["appointment.get-appointments"], {
    select(data) {
      return data?.map((appointment) => {
        return {
          ...appointment,
          title: "Appointment " + appointment.id,
        };
      });
    },
    onSuccess(data) {
      setAppointments(data);
    },
  });

  const { mutate: updateMutate, isLoading: isUpdateLoading } = trpc.useMutation(
    "appointment.update-appointment",
    {
      onSuccess: (data) => {
        setAppointments((prev) =>
          prev?.map((item) => {
            if (item.id === data.id) {
              return { ...item, ...data };
            }
            return item;
          })
        );
        resetUpdate();
        setSelectedAppointment(undefined);
      },
    }
  );

  const { mutate: deleteMutate } = trpc.useMutation(
    "appointment.delete-appointment",
    {
      onMutate: (variables) => {
        setAppointments((prev) =>
          prev?.filter((item) => item.id !== variables.id)
        );
        setSelectedAppointment(undefined);
      },
    }
  );

  const appointmentStatus = (
    Object.keys(AppointmentStatus) as (keyof typeof AppointmentStatus)[]
  ).map((enumKey) => {
    return {
      label: AppointmentStatus[enumKey].toLowerCase(),
      value: AppointmentStatus[enumKey],
    };
  });

  function onUpdateSubmit(values: UpdateAppointmentInput) {
    updateMutate({
      ...values,
      start: moment(values.start).toDate(),
      end: moment(values.end).toDate(),
    });
  }

  const deleteDialog = ({
    appointment,
  }: {
    appointment: {
      title: string;
      id: number;
      status: AppointmentStatus;
      start: Date | null;
      end: Date | null;
      physicianId: number;
      medicalRecordId: number | null;
      MedicalRecord:
        | (MedicalRecord & {
            room: Room | null;
            patient: Patient | null;
          })
        | null;
      physician: Physician;
    };
  }) => {
    if (window.confirm("Are you sure to Delete this Appointment Data?")) {
      deleteMutate({ ...appointment });
    }
  };
  // TODO add physician data

  console.log(selectedAppointment);
  return (
    <div className="w-full h-full">
      {appointments ? (
        <Calendar
          selectable
          localizer={localizer}
          events={appointments}
          defaultView={Views.MONTH}
          views={[Views.MONTH, Views.WEEK, Views.DAY, Views.AGENDA]}
          defaultDate={new Date()}
          popup={true}
          eventPropGetter={(event) => {
            const backgroundColor2 = event.status === "Finished" ? "green" : "";

            const backgroundColor =
              event.status === "Cancelled" ? "red" : backgroundColor2;
            return { style: { backgroundColor } };
          }}
          onSelectEvent={(data) => {
            setSelectedAppointment(data);
            if (data) {
              resetUpdate(data);
            }
          }}
          // onNavigate={(data) => {
          //   console.log("onNavigate", data);
          // }}
          // onSelectSlot={(data) => {
          //   console.log("onSelectSlot Start", data.start);
          //   console.log("onSelectSlot End", data.end);
          // }}
          // onKeyPressEvent={(e) => {
          //   console.log(e, "Event data");
          // }}
        />
      ) : null}
      <LocalizationProvider dateAdapter={AdapterMoment}>
        <Dialog
          open={selectedAppointment ? true : false}
          onClose={() => setSelectedAppointment(undefined)}
          maxWidth="md"
        >
          <div className="w-[900px] h-screen flex flex-col items-center overflow-hidden">
            <div className="w-full h-auto flex justify-end p-5">
              <div className="w-fit">
                <OutlinedButton
                  onClick={() => setSelectedAppointment(undefined)}
                >
                  <XSquare size={24} />
                </OutlinedButton>
              </div>
            </div>
            {selectedAppointment ? (
              <>
                <form
                  className="flex-1 flex flex-col items-center mt-5 mb-20"
                  onSubmit={handleUpdateSubmit(onUpdateSubmit)}
                >
                  <div className="flex flex-col w-full max-w-md">
                    <div className="col-span-1 space-y-3">
                      <div>
                        <label className="block text-sm font-medium text-grey-700">
                          Patient Name
                        </label>
                        <div className="relative mt-1 rounded-md shadow-sm ">
                          <h3 className="w-full h-10 flex items-center capitalize rounded-md border  border-gray-100 pl-3 pr-12 focus:border-green-500 focus:ring-4 focus:ring-green-200 sm:text-sm">
                            {
                              selectedAppointment.MedicalRecord?.patient
                                ?.firstName
                            }{" "}
                            {
                              selectedAppointment.MedicalRecord?.patient
                                ?.lastName
                            }
                          </h3>
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-grey-700">
                          Physician Name
                        </label>
                        <div className="relative mt-1 rounded-md shadow-sm ">
                          <h3 className="w-full h-10 flex items-center capitalize rounded-md border  border-gray-100 pl-3 pr-12 focus:border-green-500 focus:ring-4 focus:ring-green-200 sm:text-sm">
                            {selectedAppointment.physician?.user.firstName}{" "}
                            {selectedAppointment.physician.user.lastName}
                          </h3>
                        </div>
                      </div>
                      {selectedAppointment.MedicalRecord?.room ? (
                        <div className="grid grid-cols-2 gap-2 items-end">
                          <div>
                            <label className="block text-sm font-medium text-gray-900 dark:text-gray-300">
                              Floor No.
                            </label>
                            <div className="relative mt-1 rounded-md shadow-sm ">
                              <h3 className="w-full h-10 flex items-center capitalize rounded-md border  border-gray-100 pl-3 pr-12 focus:border-green-500 focus:ring-4 focus:ring-green-200 sm:text-sm">
                                {selectedAppointment.MedicalRecord?.room?.floor}
                              </h3>
                            </div>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-900 dark:text-gray-300">
                              Room
                            </label>
                            <div className="relative mt-1 rounded-md shadow-sm ">
                              <h3 className="w-full h-10 flex items-center capitalize rounded-md border  border-gray-100 pl-3 pr-12 focus:border-green-500 focus:ring-4 focus:ring-green-200 sm:text-sm">
                                {
                                  selectedAppointment.MedicalRecord?.room
                                    ?.roomNo
                                }
                              </h3>
                            </div>
                          </div>
                        </div>
                      ) : null}
                      <div className="flex flex-col justify-between">
                        <label className="block text-sm font-medium text-gray-900 dark:text-gray-300">
                          Schedule Start
                        </label>
                        <Controller
                          control={controlUpdate}
                          name="start"
                          render={({ field: { onChange, value } }) => (
                            <DateTimePicker
                              renderInput={(props) => (
                                <TextField
                                  size="small"
                                  {...props}
                                  sx={{ width: "100%" }}
                                />
                              )}
                              value={value ? value : new Date()}
                              onChange={(newValue) => {
                                onChange(newValue ?? new Date());
                              }}
                              disabled={!isNurse}
                            />
                          )}
                        />
                      </div>
                      <div className="flex flex-col justify-between">
                        <label className="block text-sm font-medium text-gray-900 dark:text-gray-300">
                          Schedule End
                        </label>
                        <Controller
                          control={controlUpdate}
                          name="end"
                          render={({ field: { onChange, value } }) => (
                            <DateTimePicker
                              renderInput={(props) => (
                                <TextField
                                  size="small"
                                  {...props}
                                  sx={{ width: "100%" }}
                                />
                              )}
                              value={value ? value : new Date()}
                              onChange={(newValue) => {
                                onChange(newValue ?? new Date());
                              }}
                              disabled={!isNurse}
                            />
                          )}
                        />
                      </div>
                      <div className="flex flex-col justify-between">
                        <label className="block text-sm font-medium text-gray-900 dark:text-gray-300">
                          Status
                        </label>
                        <Controller
                          control={controlUpdate}
                          name="status"
                          render={({ field: { onChange, value } }) => (
                            <Select
                              className="capitalize"
                              classNamePrefix="addl-class"
                              options={appointmentStatus}
                              value={appointmentStatus.find(
                                (c) => c.value === value
                              )}
                              onChange={(status) => onChange(status?.value)}
                              isDisabled={!isNurse}
                            />
                          )}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="w-full max-w-md my-5 flex items-center justify-between">
                    <div className="py-3 text-right flex gap-2 justify-end">
                      <OutlinedButton
                        type="button"
                        onClick={() =>
                          deleteDialog({ appointment: selectedAppointment })
                        }
                      >
                        <Trash2 size={24} />
                      </OutlinedButton>
                    </div>
                    <div>
                      <PrimaryButton
                        className="w-full min-w-[150px]"
                        isLoading={isUpdateLoading}
                        disabled={!isUpdateDirty}
                        type="submit"
                      >
                        Update
                      </PrimaryButton>
                    </div>
                  </div>
                </form>
              </>
            ) : null}
          </div>
        </Dialog>
      </LocalizationProvider>
    </div>
  );
};

export default Apointment;
