import { useState } from "react";
import { Check, ChevronsUpDown } from "lucide-react";
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

export default function GroupSelect({
    value = "",
    onChange,
    groups = [],
    placeholder = "Pilih grup",
    className = "",
}) {
    const [open, setOpen] = useState(false);

    const selected = groups.find((g) => g.id === value);

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
                    <ChevronsUpDown className="ml-2 size-4 shrink-0 opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0">
                <Command>
                    <CommandInput placeholder="Cari grup..." />
                    <CommandList>
                        <CommandEmpty>Grup tidak ditemukan</CommandEmpty>
                        <CommandGroup>
                            {groups.map((g) => (
                                <CommandItem
                                    key={g.id}
                                    value={g.name}
                                    onSelect={() => {
                                        onChange(
                                            value === g.id ? "" : g.id,
                                        );
                                        setOpen(false);
                                    }}
                                >
                                    <Check
                                        className={cn(
                                            "mr-2 size-4",
                                            value === g.id
                                                ? "opacity-100"
                                                : "opacity-0",
                                        )}
                                    />
                                    {g.name}
                                </CommandItem>
                            ))}
                        </CommandGroup>
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    );
}
