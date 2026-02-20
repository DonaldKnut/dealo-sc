// components/TimeSlotPicker.tsx
"use client";

import { useFieldArray, useWatch } from "react-hook-form";
import { Button } from "@/components/ui/button";

const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

export default function TimeSlotPicker({
  control,
  setValue,
}: {
  control: any;
  setValue: any;
}) {
  const { fields, append, remove } = useFieldArray({
    control,
    name: "availabilitySlots",
  });

  const slots = useWatch({ control, name: "availabilitySlots" });

  const addSlot = () => {
    append({ day: "Mon", startTime: "09:00", endTime: "17:00" });
  };

  return (
    <div className="space-y-4">
      <h4 className="text-green-300 font-medium">Availability Slots</h4>

      {fields.map((field, index) => (
        <div key={field.id} className="grid grid-cols-4 gap-2 items-center">
          <select
            className="rounded-md p-1 bg-[#1e2b23] text-white"
            {...control.register(`availabilitySlots.${index}.day`)}
          >
            {days.map((day) => (
              <option key={day} value={day}>
                {day}
              </option>
            ))}
          </select>
          <input
            type="time"
            className="rounded-md p-1 bg-[#1e2b23] text-white"
            {...control.register(`availabilitySlots.${index}.startTime`)}
          />
          <input
            type="time"
            className="rounded-md p-1 bg-[#1e2b23] text-white"
            {...control.register(`availabilitySlots.${index}.endTime`)}
          />
          <Button
            type="button"
            variant="destructive"
            onClick={() => remove(index)}
          >
            Remove
          </Button>
        </div>
      ))}

      <Button type="button" variant="outline" onClick={addSlot}>
        Add Time Slot
      </Button>
    </div>
  );
}
