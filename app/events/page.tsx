"use client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { fixtures } from "@/lib/seededData";
import { format } from "date-fns";

const events = [
  { id: 1, title: "Derby watch at The Crown", location: "The Crown, Shoreditch", fixtureId: fixtures[0].id, kickoffTs: fixtures[0].kickoffTs },
  { id: 2, title: "Champions League banter night", location: "Tommy's flat", fixtureId: fixtures[1].id, kickoffTs: fixtures[1].kickoffTs },
  { id: 3, title: "BBQ + Villa vs United", location: "Victoria Park", fixtureId: fixtures[2].id, kickoffTs: fixtures[2].kickoffTs },
];

function toICS(event: typeof events[number]) {
  const dt = format(event.kickoffTs, "yyyyMMdd'T'HHmm'00'");
  return [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//BanterBoard//EN",
    "BEGIN:VEVENT",
    `UID:${event.id}@banterboard`,
    `DTSTAMP:${dt}Z`,
    `DTSTART:${dt}Z`,
    `SUMMARY:${event.title}`,
    `LOCATION:${event.location}`,
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\n");
}

export default function EventsPage() {
  return (
    <main className="space-y-4">
      <Card>
        <h1 className="text-xl font-bold mb-2">Watch parties & meetups</h1>
        <div className="space-y-3">
          {events.map((event) => (
            <div key={event.id} className="bg-slate-800/60 rounded-lg px-3 py-2">
              <p className="font-semibold">{event.title}</p>
              <p className="text-sm text-slate-400">{event.location} · {format(event.kickoffTs, "EEE dd MMM HH:mm")}</p>
              <Button
                className="mt-2"
                onClick={() => {
                  const blob = new Blob([toICS(event)], { type: "text/calendar" });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement("a");
                  a.href = url;
                  a.download = `${event.title}.ics`;
                  a.click();
                }}
              >
                Add to calendar
              </Button>
            </div>
          ))}
        </div>
      </Card>
    </main>
  );
}
