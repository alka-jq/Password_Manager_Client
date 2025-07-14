import React, { useEffect, useRef } from 'react';
import { FiExternalLink } from 'react-icons/fi';
import { IoCloseSharp } from 'react-icons/io5';

interface SideCalendarProps {
  onclick: () => void;
}


const SideCalendar: React.FC<SideCalendarProps> = ({ onclick }) => {

  const ref = useRef<HTMLDivElement>(null);


  useEffect(() => {
    const handler = (e: any) => {
      if (ref.current && !ref.current.contains(e.target)) onclick();
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);


  return (
    <div ref={ref} className="w-72  h-[90vh] settingAnimation rounded-2xl text-black 
      ">
      <div className="flex justify-between px-4 py-3 items-center  ">
        <div>
          <h1 className="uppercase text-[11px] tracking-widest font-medium">Calendar</h1>
        </div>
        <div>
          <button className="hover:bg-[#DCDCDC] transition rounded-full p-2">
            <FiExternalLink size={20} />
          </button>
          <button onClick={onclick} className="hover:bg-[#DCDCDC] transition rounded-full p-2">
            <IoCloseSharp size={20} />
          </button>
        </div>
      </div>

      {/* calendar */}
      <div className=" max-w-md mx-auto  rounded shadow">
        <div className="w-full h-[80vh]  rounded overflow-hidden shadow-lg">
          <iframe
            src="https://calendar.google.com/calendar/embed?src=YOUR_CALENDAR_ID&mode=DAY&showTitle=0&showTabs=0&showPrint=0&showCalendars=0&ctz=Asia%2FKolkata"
            style={{ border: 0 }}
            className="w-full h-full"
            frameBorder="0"
            scrolling="no"
            title="Google Calendar Day View"
          ></iframe>
        </div>
      </div>
    </div>
  );
};

export default SideCalendar;
