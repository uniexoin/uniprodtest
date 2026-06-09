'use client';
import { useState, useEffect } from "react";
import { Info } from "lucide-react";
import { useVendorRoomOccupancy } from "@/hooks/use-dashboard";

interface GridCell {
  suite: string;
  date: string;
  status: "Available" | "Occupied" | "Pending" | "Maintenance";
}

export function RoomGrid() {
  const { data: roomData } = useVendorRoomOccupancy();
  
  const dates = ["Jun 9", "Jun 10", "Jun 11", "Jun 12", "Jun 13", "Jun 14", "Jun 15"];
  
  const defaultSuites = [
    "Penthouse Suite 101",
    "Atherton Premium Room A",
    "Velvet Townhouse Suite B",
    "Napa Vineyard Cabin 3",
    "SoHo Industrial Loft D",
    "Pacific Heights Studio 6",
  ];

  const suites = roomData?.rooms && roomData.rooms.length > 0 
    ? roomData.rooms.map((r: any) => r.name || `Room ${r.id}`)
    : defaultSuites;

  // Load clean reactive occupancy matrix
  const [matrix, setMatrix] = useState<GridCell[]>(() => {
    const initial: GridCell[] = [];
    suites.forEach((suite: string) => {
      dates.forEach((date, index) => {
        // Mock some bookings based on actual suite indices
        let status: "Available" | "Occupied" | "Pending" | "Maintenance" = "Available";
        const sIndex = suites.indexOf(suite);
        if ((sIndex + index) % 4 === 0) status = "Occupied";
        else if ((sIndex * index) % 5 === 1) status = "Pending";
        else if (index === 2 && sIndex === 4) status = "Maintenance";

        initial.push({ suite, date, status });
      });
    });
    return initial;
  });

  // Recompute if suites change based on live data
  useEffect(() => {
    if (roomData?.rooms && roomData.rooms.length > 0) {
        const newSuites = roomData.rooms.map((r: any) => r.name || `Room ${r.id}`);
        const initial: GridCell[] = [];
        newSuites.forEach((suite: string) => {
          dates.forEach((date, index) => {
            let status: "Available" | "Occupied" | "Pending" | "Maintenance" = "Available";
            const sIndex = newSuites.indexOf(suite);
            if ((sIndex + index) % 4 === 0) status = "Occupied";
            else if ((sIndex * index) % 5 === 1) status = "Pending";
            else if (index === 2 && sIndex === 4) status = "Maintenance";
    
            initial.push({ suite, date, status });
          });
        });
        setMatrix(initial);
    }
  }, [roomData]);

  const getCell = (suite: string, date: string) => {
    return matrix.find((c) => c.suite === suite && c.date === date);
  };

  const handleCellClick = (suite: string, date: string) => {
    setMatrix((prev) =>
      prev.map((cell) => {
        if (cell.suite === suite && cell.date === date) {
          // Cycle through states
          const states: GridCell["status"][] = ["Available", "Occupied", "Pending", "Maintenance"];
          const currentIdx = states.indexOf(cell.status);
          const nextState = states[(currentIdx + 1) % states.length];
          return { ...cell, status: nextState };
        }
        return cell;
      })
    );
  };

  const colors = {
    Available: "bg-green-50 text-green-700 hover:bg-green-100 border-green-200",
    Occupied: "bg-primary-container text-white hover:opacity-90 border-primary",
    Pending: "bg-blue-50 text-blue-700 hover:bg-blue-100 border-blue-200",
    Maintenance: "bg-amber-50 text-amber-900 border-amber-200 hover:bg-amber-100",
  };

  return (
    <div className="space-y-8">
      {/* Header Context details */}
      <div>
        <h2 className="text-3xl font-bold text-on-surface tracking-tight">Room Occupancy Grid</h2>
        <p className="text-sm text-secondary font-medium">Interactive live calendar manifest. Click any node to cycle reservation status.</p>
      </div>

      {/* Grid Legend index */}
      <div className="flex flex-wrap items-center gap-4 bg-white/70 p-4 rounded-2xl border border-gray-100 shadow-sm text-xs font-bold text-secondary">
        <span className="flex items-center gap-1.5 font-semibold text-secondary">Legend:</span>
        <span className="flex items-center gap-1"><span className="w-3 h-3 bg-green-200 rounded border border-green-300 inline-block" /> Available</span>
        <span className="flex items-center gap-1"><span className="w-3 h-3 bg-primary-container rounded inline-block" /> Occupied (Booked)</span>
        <span className="flex items-center gap-1"><span className="w-3 h-3 bg-blue-200 rounded border border-blue-300 inline-block" /> Pending Triage</span>
        <span className="flex items-center gap-1"><span className="w-3 h-3 bg-amber-200 rounded border border-amber-300 inline-block" /> Out of Service (Maintenance)</span>
      </div>

      {/* Grid Matrix Dashboard style */}
      <div className="glass-panel rounded-2xl p-6 overflow-x-auto">
        <div className="min-w-[800px]">
          <div className="grid grid-cols-8 gap-3 items-center mb-4">
            {/* Header dates label */}
            <div className="text-xs font-semibold text-secondary uppercase tracking-widest pl-2">Suite Identifier</div>
            {dates.map((d) => (
              <div key={d} className="text-center">
                <span className="text-xs font-bold text-on-surface uppercase tracking-wider block">{d}</span>
                <span className="text-[9px] text-secondary font-mono">June</span>
              </div>
            ))}
          </div>

          <div className="space-y-3">
            {suites.map((suite: string) => (
              <div key={suite} className="grid grid-cols-8 gap-3 items-center">
                
                {/* Room Title */}
                <div className="text-xs font-bold text-on-surface truncate pl-2" title={suite}>
                  {suite}
                </div>

                {/* Calendar Days */}
                {dates.map((date) => {
                  const cell = getCell(suite, date);
                  const status = cell?.status || "Available";

                  return (
                    <div
                      key={date}
                      onClick={() => handleCellClick(suite, date)}
                      className={`h-12 border rounded-xl flex flex-col justify-center items-center cursor-pointer transition-all duration-150 p-1 select-none ${colors[status]}`}
                    >
                      <span className="text-[10px] font-extrabold uppercase tracking-wide">
                        {status === "Available" ? "Avail" : status === "Occupied" ? "Booked" : status}
                      </span>
                      <span className="text-[8px] opacity-75 font-mono">Tap cycle</span>
                    </div>
                  );
                })}

              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2 bg-primary/5 p-4 rounded-xl text-xs text-primary-container font-semibold">
        <Info className="w-4 h-4 text-primary" />
        <span>Your inventory updates are pushed in real-time to Expedia Executive, Booking Elite private corporate catalog channels.</span>
      </div>
    </div>
  );
}
