import { UpdateAppointmentInput } from "@/schema/appointment.schema";
import { Dialog, DialogContent } from "@mui/material";
import { Appointment, AppointmentStatus } from "@prisma/client";
import { trpc } from "@utils/trpc";
import moment from "moment";
import type { NextPage } from "next";
import { useState } from "react";
import { Calendar, momentLocalizer, Views } from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { Controller, useForm } from "react-hook-form";
import Select from "react-select";

const localizer = momentLocalizer(moment);

const Apointment: NextPage = () => {
  const { handleSubmit, control, register, reset } =
    useForm<UpdateAppointmentInput>();

  const [selectedAppointment, setSelectedAppointment] =
    useState<Appointment | null>();

  const { data } = trpc.useQuery(["appointment.get-appointments"], {
    select(data) {
      return data?.map((appointment) => {
        return {
          ...appointment,
          title:
            "Session on " +
            `floor: ${appointment.MedicalRecord?.room?.floor} ,
           room: ${appointment.MedicalRecord?.room?.roomNo} `,
        };
      });
    },
  });

  const appointmentStatus = (
    Object.keys(AppointmentStatus) as (keyof typeof AppointmentStatus)[]
  ).map((enumKey) => {
    return {
      label: AppointmentStatus[enumKey].toLowerCase(),
      value: AppointmentStatus[enumKey],
    };
  });

  return (
    <div className="w-full h-full">
      {data ? (
        <Calendar
          selectable
          localizer={localizer}
          events={data}
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
              reset(data);
            }
          }}
          onNavigate={(data) => {
            console.log("onNavigate", data);
          }}
          onSelectSlot={(data) => {
            console.log("onSelectSlot Start", data.start);
            console.log("onSelectSlot End", data.end);
          }}
          onKeyPressEvent={(e) => {
            console.log(e, "Event data");
          }}
        />
      ) : null}
      <Dialog
        open={selectedAppointment ? true : false}
        onClose={() => setSelectedAppointment(null)}
        maxWidth={"xl"}
        PaperProps={{
          style: {
            backgroundColor: "transparent",
            boxShadow: "none",
            margin: 0,
            padding: 0,
          },
        }}
      >
        <DialogContent>
          {selectedAppointment ? (
            <div className="h-[50vh] w-full bg-white max-w-lg pt-5 p-20 overflow-hidden">
              {/* Todo change to form for auto update and edit */}
              <input
                className="block w-full h-12 rounded-md border  border-gray-300 pl-3 pr-12 focus:border-green-500 focus:ring-4 focus:ring-green-200 sm:text-sm focus:outline-green-500"
                {...register("start")}
              />
              <input
                className="block w-full h-12 rounded-md border  border-gray-300 pl-3 pr-12 focus:border-green-500 focus:ring-4 focus:ring-green-200 sm:text-sm focus:outline-green-500"
                {...register("end")}
              />
              <input
                className="block w-full h-12 rounded-md border  border-gray-300 pl-3 pr-12 focus:border-green-500 focus:ring-4 focus:ring-green-200 sm:text-sm focus:outline-green-500"
                {...register("status")}
              />
              <div>
                <label className="block text-sm font-medium text-gray-900 dark:text-gray-300">
                  Status
                </label>
                <Controller
                  control={control}
                  defaultValue={selectedAppointment.status}
                  name="status"
                  render={({ field: { onChange, value } }) => (
                    <Select
                      className="capitalize"
                      classNamePrefix="addl-class"
                      options={appointmentStatus}
                      value={appointmentStatus.find((c) => c.value === value)}
                      onChange={(gender) => onChange(gender?.value)}
                    />
                  )}
                />
              </div>
            </div>
          ) : null}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Apointment;
