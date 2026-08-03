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

const typeLabel = (type) => (type === "multiple_choice" ? "PG" : "Essay");

export default function QuestionSelect({
    value = "",
    onChange,
    questions = [],
    placeholder = "Cari soal...",
    className = "",
}) {
    const [open, setOpen] = useState(false);

    const selected = questions.find((q) => String(q.id) === String(value));

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className={cn(
                        "w-full justify-between",
                        !selected && "text-muted-foreground",
                        className,
                    )}
                >
                    {selected ? (
                        <span className="line-clamp-1 text-left font-normal">
                            <span className="font-medium">
                                [{typeLabel(selected.type)}]
                            </span>{" "}
                            {selected.question_text}
                        </span>
                    ) : (
                        placeholder
                    )}
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
                    <CommandInput placeholder="Cari soal..." />
                    <CommandList>
                        <CommandEmpty>Soal tidak ditemukan</CommandEmpty>
                        <CommandGroup>
                            {questions.map((q) => (
                                <CommandItem
                                    key={q.id}
                                    value={q.question_text}
                                    onSelect={() => {
                                        onChange(
                                            String(q.id) === String(value)
                                                ? ""
                                                : q.id,
                                        );
                                        setOpen(false);
                                    }}
                                >
                                    <Check
                                        className={cn(
                                            "mr-2 size-4 shrink-0",
                                            String(q.id) === String(value)
                                                ? "opacity-100"
                                                : "opacity-0",
                                        )}
                                    />
                                    <span className="shrink-0 font-medium">
                                        [{typeLabel(q.type)}]
                                    </span>
                                    <span className="line-clamp-2">
                                        {q.question_text}
                                    </span>
                                </CommandItem>
                            ))}
                        </CommandGroup>
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    );
}
