import { useState } from "react";
import { router } from "@inertiajs/react";
import axios from "axios";
import {
    AlertCircle,
    FileSpreadsheet,
    CheckCircle2,
    Download,
    Upload,
    Eye,
    Loader2,
} from "lucide-react";
import { Button } from "@/Components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/Components/ui/dialog";
import { Field, FieldDescription, FieldLabel } from "@/Components/ui/field";
import { Input } from "@/Components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/Components/ui/select";
import {
    Table,
    TableHeader,
    TableRow,
    TableHead,
    TableBody,
    TableCell,
} from "@/Components/table/BasicTable";
import { Badge } from "@/Components/ui/badge";

export default function ImportDialog({
    title = "Import Data",
    description = "Import data secara massal menggunakan file excel.",
    downloadUrl,
    previewUrl,
    importUrl,
    columns = [],
    extraFields = [],
    triggerLabel = "Import",
}) {
    const [open, setOpen] = useState(false);
    const [file, setFile] = useState(null);
    const [preview, setPreview] = useState(null);
    const [loading, setLoading] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState("");
    const [fieldValues, setFieldValues] = useState({});

    const reset = () => {
        setFile(null);
        setPreview(null);
        setLoading(false);
        setSubmitting(false);
        setError("");
        setFieldValues({});
    };

    const handleOpenChange = (val) => {
        if (!val) {
            reset();
        }
        setOpen(val);
    };

    const handleFileChange = (e) => {
        const selected = e.target.files?.[0] || null;
        setFile(selected);
        setPreview(null);
        setError("");
    };

    const handlePreview = async () => {
        if (!file) {
            setError("Silakan pilih file excel terlebih dahulu.");
            return;
        }

        const missingRequired = extraFields.find(
            (field) =>
                field.required &&
                !String(fieldValues[field.name] ?? "").trim(),
        );

        if (missingRequired) {
            setError(`${missingRequired.label} wajib diisi terlebih dahulu.`);
            return;
        }

        setLoading(true);
        setError("");

        const formData = new FormData();
        formData.append("file", file);

        extraFields.forEach((field) => {
            if (fieldValues[field.name]) {
                formData.append(field.name, fieldValues[field.name]);
            }
        });

        try {
            const { data } = await axios.post(previewUrl, formData);
            setPreview(data);
        } catch (err) {
            const message =
                err?.response?.data?.message ||
                "Terjadi kesalahan saat membaca file. Silakan coba lagi.";
            setError(message);
            setPreview(null);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = () => {
        setSubmitting(true);
        router.post(
            importUrl,
            { token: preview.token },
            {
                preserveState: false,
                onError: () => setSubmitting(false),
                onFinish: () => setSubmitting(false),
            },
        );
    };

    const errorCount =
        preview?.rows?.filter((r) => r.errors.length > 0).length || 0;

    return (
        <>
            <Button onClick={() => handleOpenChange(true)}>
                <Upload className="w-5 h-5 mr-2" />
                {triggerLabel}
            </Button>

            <Dialog open={open} onOpenChange={handleOpenChange}>
                <DialogContent className="sm:max-w-3xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>{title}</DialogTitle>
                        <DialogDescription>{description}</DialogDescription>
                    </DialogHeader>

                    <div className="space-y-5">
                        {error && (
                            <div className="flex items-start gap-2 rounded-lg border border-red-300 bg-red-50 p-3 text-sm text-red-700 dark:border-red-900 dark:bg-red-950/40 dark:text-red-400">
                                <AlertCircle className="mt-0.5 size-4 shrink-0" />
                                <span>{error}</span>
                            </div>
                        )}

                        {!preview ? (
                            <>
                                {extraFields.map((field) => (
                                    <Field key={field.name}>
                                        <FieldLabel>{field.label}</FieldLabel>
                                        <Select
                                            value={String(
                                                fieldValues[field.name] ?? "",
                                            )}
                                            onValueChange={(val) =>
                                                setFieldValues((prev) => ({
                                                    ...prev,
                                                    [field.name]: val,
                                                }))
                                            }
                                            disabled={loading}
                                        >
                                            <SelectTrigger className="w-full">
                                                <SelectValue
                                                    placeholder={
                                                        field.placeholder ||
                                                        "Pilih..."
                                                    }
                                                />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {field.options.map((opt) => (
                                                    <SelectItem
                                                        key={opt.value}
                                                        value={String(
                                                            opt.value,
                                                        )}
                                                    >
                                                        {opt.label}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </Field>
                                ))}

                                <Field>
                                    <FieldLabel>File Excel</FieldLabel>
                                    <Input
                                        type="file"
                                        accept=".xlsx,.xls"
                                        onChange={handleFileChange}
                                        disabled={loading}
                                    />
                                    <FieldDescription>
                                        Format file: .xlsx atau .xls. Gunakan
                                        template yang disediakan agar kolom
                                        sesuai.
                                    </FieldDescription>
                                </Field>

                                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                                    <a
                                        href={downloadUrl}
                                        className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline"
                                    >
                                        <Download className="size-4" />
                                        Download Template Excel
                                    </a>

                                    <div className="flex items-center gap-2">
                                        <Button
                                            type="button"
                                            variant="outline"
                                            onClick={() =>
                                                handleOpenChange(false)
                                            }
                                            disabled={loading}
                                        >
                                            Batal
                                        </Button>
                                        <Button
                                            type="button"
                                            onClick={handlePreview}
                                            disabled={loading || !file}
                                        >
                                            {loading ? (
                                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                            ) : (
                                                <Eye className="w-5 h-5 mr-2" />
                                            )}
                                            {loading ? "Memproses..." : "Preview"}
                                        </Button>
                                    </div>
                                </div>
                            </>
                        ) : (
                            <>
                                <div className="flex flex-wrap items-center justify-between gap-3">
                                    <div className="flex items-center gap-2">
                                        <FileSpreadsheet className="size-4 text-muted-foreground" />
                                        <span className="text-sm text-muted-foreground">
                                            {preview.total} baris ditemukan
                                        </span>
                                        {preview.has_errors && (
                                            <Badge
                                                variant="secondary"
                                                className="bg-red-100 text-red-900"
                                            >
                                                {errorCount} baris bermasalah
                                            </Badge>
                                        )}
                                        {!preview.has_errors && (
                                            <Badge
                                                variant="secondary"
                                                className="bg-green-100 text-green-900"
                                            >
                                                Semua data valid
                                            </Badge>
                                        )}
                                    </div>
                                </div>

                                <div className="max-h-72 overflow-auto">
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead>Baris</TableHead>
                                                {columns.map((col) => (
                                                    <TableHead key={col.key}>
                                                        {col.label}
                                                    </TableHead>
                                                ))}
                                                <TableHead>Status</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {preview.rows.map((row) => (
                                                <TableRow
                                                    key={row.row}
                                                    className={
                                                        row.errors.length > 0
                                                            ? "bg-red-50 dark:bg-red-950/40"
                                                            : ""
                                                    }
                                                >
                                                    <TableCell>
                                                        {row.row}
                                                    </TableCell>
                                                    {columns.map((col) => (
                                                        <TableCell key={col.key}>
                                                            {row[col.key] ===
                                                                null ||
                                                            row[col.key] === ""
                                                                ? "-"
                                                                : row[col.key]}
                                                        </TableCell>
                                                    ))}
                                                    <TableCell>
                                                        {row.errors.length > 0 ? (
                                                            <ul className="list-disc space-y-0.5 pl-4 text-xs text-red-600 dark:text-red-400">
                                                                {row.errors.map(
                                                                    (msg, i) => (
                                                                        <li
                                                                            key={i}
                                                                        >
                                                                            {msg}
                                                                        </li>
                                                                    ),
                                                                )}
                                                            </ul>
                                                        ) : (
                                                            <span className="inline-flex items-center gap-1 text-xs text-green-600 dark:text-green-400">
                                                                <CheckCircle2 className="size-3.5" />
                                                                OK
                                                            </span>
                                                        )}
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </div>

                                <div className="flex items-center justify-between gap-3 border-t pt-4">
                                    <div className="flex items-center gap-2">
                                        <Button
                                            type="button"
                                            variant="outline"
                                            onClick={() => setPreview(null)}
                                            disabled={submitting}
                                        >
                                            Ubah File
                                        </Button>
                                        <Button
                                            type="button"
                                            variant="outline"
                                            onClick={() =>
                                                handleOpenChange(false)
                                            }
                                            disabled={submitting}
                                        >
                                            Batal
                                        </Button>
                                    </div>
                                    {!preview.has_errors && (
                                        <Button
                                            type="button"
                                            onClick={handleSubmit}
                                            disabled={submitting}
                                        >
                                            {submitting ? (
                                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                            ) : (
                                                <Upload className="w-5 h-5 mr-2" />
                                            )}
                                            {submitting
                                                ? "Mengimpor..."
                                                : "Submit"}
                                        </Button>
                                    )}
                                </div>
                            </>
                        )}
                    </div>
                </DialogContent>
            </Dialog>
        </>
    );
}
