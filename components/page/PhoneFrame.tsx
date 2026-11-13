import { BatteryFull, Signal, Wifi } from "lucide-react";
import type { ReactNode } from "react";

export default function PhoneFrame({
  children,
  lightStatus = false,
  scroll = false,
}: {
  children: ReactNode;
  lightStatus?: boolean;
  scroll?: boolean;
}) {
  return (
    <div
      data-testid="phone-frame"
      className="profile-phone-frame relative w-[300px] h-[600px] shrink-0 bg-black rounded-[40px] shadow-phone border-[8px] border-black overflow-hidden z-0"
    >
      <div
        className={`phone-status absolute top-0 w-full h-8 z-20 flex justify-between items-center px-6 pt-2 text-xs font-semibold ${lightStatus ? "text-gray-900" : "text-white"}`}
      >
        <span>9:41</span>
        <div className="flex gap-1.5 items-center">
          <Signal size={10} aria-hidden="true" />
          <Wifi size={10} aria-hidden="true" />
          <BatteryFull size={10} aria-hidden="true" />
        </div>
      </div>
      <div
        className="absolute top-2 left-1/2 -translate-x-1/2 w-20 h-5 bg-black rounded-full z-20"
        aria-hidden="true"
      />
      <div
        className={`phone-screen w-full h-full bg-white relative ${scroll ? "overflow-y-auto overflow-x-hidden custom-scrollbar" : "overflow-hidden"}`}
      >
        {children}
      </div>
    </div>
  );
}
