import Main from "@/components/Layout/Main";
import moment from "moment";
import type { NextPage } from "next";
import Head from "next/head";
import { Calendar, momentLocalizer, Views } from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";

moment.locale("en-GB");
//momentLocalizer(moment);
const localizer = momentLocalizer(moment);

const events = [
  {
    id: 0,
    title: "Board meeting",
    start: new Date(2018, 0, 29, 9, 0, 0),
    end: new Date(2018, 0, 29, 13, 0, 0),
    resourceId: 1,
  },
  {
    id: 1,
    title: "MS training",
    allDay: true,
    start: new Date(2018, 0, 29, 14, 0, 0),
    end: new Date(2018, 0, 29, 16, 30, 0),
    resourceId: 2,
  },
  {
    id: 2,
    title: "Team lead meeting",
    start: new Date(2018, 0, 29, 8, 30, 0),
    end: new Date(2018, 0, 29, 12, 30, 0),
    resourceId: 3,
  },
  {
    id: 11,
    title: "Birthday Party",
    start: new Date(2018, 0, 30, 7, 0, 0),
    end: new Date(2018, 0, 30, 10, 30, 0),
    resourceId: 4,
  },
];

const resourceMap = [
  { resourceId: 1, resourceTitle: "Board room" },
  { resourceId: 2, resourceTitle: "Training room" },
  { resourceId: 3, resourceTitle: "Meeting room 1" },
  { resourceId: 4, resourceTitle: "Meeting room 2" },
];

const Apointment: NextPage = () => {
  return (
    <>
      <Head>
        <title>Nurse - Apointment</title>
        <link rel="icon" href="/logo.svg" />
      </Head>
      <Main>
        <div className="w-full h-full">
          <Calendar
            selectable
            localizer={localizer}
            events={events}
            defaultView={Views.MONTH}
            views={[Views.MONTH, Views.WEEK, Views.DAY]}
            //  steps={60}
            defaultDate={new Date(2018, 0, 29)}
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
          />
        </div>
      </Main>
    </>
  );
};

export default Apointment;
