import { Dialog } from "@mui/material";
import { Appointment } from "@prisma/client";
import { trpc } from "@utils/trpc";
import moment from "moment";
import type { NextPage } from "next";
import { useState } from "react";
import { Calendar, momentLocalizer, Views } from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";

// moment.locale("en-PH");
//momentLocalizer(moment);
const localizer = momentLocalizer(moment);

const Apointment: NextPage = () => {
  const [selectedAppointment, setSelectedAppointment] =
    useState<Appointment | null>();

  const { data } = trpc.useQuery(["appointment.get-appointments"], {
    select(data) {
      return data?.map((appointment) => {
        return {
          ...appointment,
          title:
            "Session on " +
            `floor: ${appointment.MedicalRecord?.room.floor} ,
           room: ${appointment.MedicalRecord?.room.roomNo} `,
        };
      });
    },
  });

  console.log(data);

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
          eventPropGetter={(event) => {
            const backgroundColor = event.cancelled ? "red" : "";
            return { style: { backgroundColor } };
          }}
          onSelectEvent={(data) => {
            setSelectedAppointment(data);
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
      ></Dialog>
    </div>
  );
};

export default Apointment;
