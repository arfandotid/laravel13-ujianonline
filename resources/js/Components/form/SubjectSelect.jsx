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

export default function SubjectSelect({
    value = "",
    onChange,
    subjects = [],
    placeholder = "Pilih mata pelajaran",
    className = "",
}) {
    const [open, setOpen] = useState(false);

    const selected = subjects.find((s) => String(s.id) === String(value));

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className={cn("w-full justify-between", className)}
                >
                    {selected ? selected.name : placeholder}
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
                    <CommandInput placeholder="Cari mata pelajaran..." />
                    <CommandList>
                        <CommandEmpty>Mata pelajaran tidak ditemukan</CommandEmpty>
                        <CommandGroup>
                            {subjects.map((s) => (
                                <CommandItem
                                    key={s.id}
                                    value={s.name}
                                    onSelect={() => {
                                        onChange(
                                            String(s.id) === String(value) ? "" : s.id,
                                        );
                                        setOpen(false);
                                    }}
                                >
                                    <Check
                                        className={cn(
                                            "mr-2 size-4",
                                            String(s.id) === String(value)
                                                ? "opacity-100"
                                                : "opacity-0",
                                        )}
                                    />
                                    {s.name}
                                </CommandItem>
                            ))}
                        </CommandGroup>
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    );
}
