import { useState } from "react";
import { format } from "date-fns";
import { id as localeId } from "date-fns/locale";
import { Calendar as CalendarIcon, Clock } from "lucide-react";
import { Button } from "@/Components/ui/button";
import { Calendar } from "@/Components/ui/calendar";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/Components/ui/popover";
import { Input } from "@/Components/ui/input";
import { cn } from "@/lib/utils";

export default function DateTimePicker({ value, onChange, placeholder = "Pilih tanggal & waktu" }) {
    // value dan onChange menggunakan format string "yyyy-MM-ddTHH:mm" (sama seperti datetime-local)
    const dateObj = value ? new Date(value) : null;
    const [open, setOpen] = useState(false);

    const timeValue = dateObj ? format(dateObj, "HH:mm") : "00:00";

    const handleDateSelect = (selectedDate) => {
        if (!selectedDate) return;

        const [hours, minutes] = timeValue.split(":").map(Number);
        const merged = new Date(selectedDate);
        merged.setHours(hours, minutes, 0, 0);

        onChange(format(merged, "yyyy-MM-dd'T'HH:mm"));
    };

    const handleTimeChange = (e) => {
        const time = e.target.value;
        if (!time) return;

        const base = dateObj ?? new Date();
        const [hours, minutes] = time.split(":").map(Number);
        const merged = new Date(base);
        merged.setHours(hours, minutes, 0, 0);

        onChange(format(merged, "yyyy-MM-dd'T'HH:mm"));
    };

    return (
        <div className="flex gap-2">
            <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                    <Button
                        type="button"
                        variant="outline"
                        className={cn(
                            "flex-1 justify-start text-left font-normal",
                            !dateObj && "text-muted-foreground"
                        )}
                    >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {dateObj
                            ? format(dateObj, "dd MMMM yyyy", { locale: localeId })
                            : placeholder}
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                        mode="single"
                        selected={dateObj ?? undefined}
                        onSelect={(d) => {
                            handleDateSelect(d);
                            setOpen(false);
                        }}
                        locale={localeId}
                        initialFocus
                    />
                </PopoverContent>
            </Popover>

            <div className="relative w-32">
                <Clock className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                <Input
                    type="time"
                    value={timeValue}
                    onChange={handleTimeChange}
                    className="pl-8"
                />
            </div>
        </div>
    );
}