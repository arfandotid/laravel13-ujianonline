import { useState } from "react";
import { Check, ChevronsUpDown, X } from "lucide-react";
import { Button } from "@/Components/ui/button";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/Components/ui/popover";
import {
    Command,
    CommandInput,
    CommandList,
    CommandEmpty,
    CommandGroup,
    CommandItem,
} from "@/Components/ui/command";
import { cn } from "@/lib/utils";

export default function ExamSelect({
    value = "",
    onChange,
    exams = [],
    placeholder = "Pilih ujian",
    className = "",
}) {
    const [open, setOpen] = useState(false);

    const selected = exams.find((e) => String(e.id) === String(value));

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className={cn("w-full justify-between", className)}
                >
                    {selected ? selected.title : placeholder}
                    {selected && (
                        <button
                            type="button"
                            onClick={(e) => {
                                e.stopPropagation();
                                onChange("");
                                setOpen(false);
                            }}
                            className="ml-auto mr-1"
                        >
                            <X className="size-4" />
                        </button>
                    )}
                    <ChevronsUpDown className="size-4 shrink-0 opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0">
                <Command>
                    <CommandInput placeholder="Cari ujian..." />
                    <CommandList>
                        <CommandEmpty>Ujian tidak ditemukan</CommandEmpty>
                        <CommandGroup>
                            {exams.map((e) => (
                                <CommandItem
                                    key={e.id}
                                    value={e.title}
                                    onSelect={() => {
                                        onChange(
                                            String(e.id) === String(value) ? "" : e.id,
                                        );
                                        setOpen(false);
                                    }}
                                >
                                    <Check
                                        className={cn(
                                            "mr-2 size-4",
                                            String(e.id) === String(value)
                                                ? "opacity-100"
                                                : "opacity-0",
                                        )}
                                    />
                                    {e.title}
                                </CommandItem>
                            ))}
                        </CommandGroup>
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    );
}
