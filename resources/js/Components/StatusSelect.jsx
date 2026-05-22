import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/Components/ui/select";

export default function StatusSelect({
    value = false,
    onChange,
    placeholder = "Pilih status",
    className = "",
}) {
    return (
        <Select
            value={value ? "1" : "0"}
            onValueChange={(val) => onChange?.(val === "1")}
        >
            <SelectTrigger className={`w-full ${className}`}>
                <SelectValue placeholder={placeholder} />
            </SelectTrigger>

            <SelectContent>
                <SelectItem value="1">Aktif</SelectItem>
                <SelectItem value="0">Non-Aktif</SelectItem>
            </SelectContent>
        </Select>
    );
}
