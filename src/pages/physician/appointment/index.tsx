import Main from "@/components/Layout/Main";
import { trpc } from "@utils/trpc";
import moment from "moment";
import type { NextPage } from "next";
import Head from "next/head";
import { Calendar, momentLocalizer, Views } from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";

moment.locale("en-PH");
//momentLocalizer(moment);
const localizer = momentLocalizer(moment);

const Apointment: NextPage = () => {
  const { data } = trpc.useQuery(["physician.get-physician"], {
    select(data) {
      return data?.Physician?.Appointment;
    },
  });

  const events = data?.map((appointment) => {
    return {
      ...appointment,
      title: "Session " + appointment.id,
      start: appointment.Start,
      end: appointment.End,
    };
  });

  console.log(events);
  return (
    <>
      <Head>
        <title>Nurse - Apointment</title>
        <link rel="icon" href="/logo.svg" />
      </Head>
      <Main>
        <div className="w-full h-full">
          {events ? (
            <Calendar
              selectable
              localizer={localizer}
              events={events}
              defaultView={Views.MONTH}
              views={[Views.MONTH, Views.WEEK]}
              //  steps={60} Views.WEEK,
              defaultDate={new Date()}
              // resources={resourceMap}
              // resourceIdAccessor="resourceId"
              // resourceTitleAccessor="resourceTitle"
              onSelectEvent={(data) => {
                console.log("onSelectSlot", data);
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
        </div>
      </Main>
    </>
  );
};

export default Apointment;
