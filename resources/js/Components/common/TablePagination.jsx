import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/Components/ui/pagination";

export default function TablePagination({ links }) {
    const prevLink = links[0];
    const nextLink = links[links.length - 1];
    const pageLinks = links.slice(1, -1);

    // Cari index active langsung dari data asli (bukan dihitung ulang)
    const activeIndex = pageLinks.findIndex((link) => link.active);
    const totalPages = pageLinks.length;

    // Tentukan index (posisi array) mana yang ditampilkan, bukan "nomor halaman"
    const getVisibleIndexes = () => {
        if (totalPages <= 7) {
            return pageLinks.map((_, i) => i);
        }

        const indexes = new Set([0, totalPages - 1]);

        for (let i = activeIndex - 1; i <= activeIndex + 1; i++) {
            if (i >= 0 && i < totalPages) indexes.add(i);
        }

        return Array.from(indexes).sort((a, b) => a - b);
    };

    const visibleIndexes = getVisibleIndexes();

    return (
        <Pagination className="flex justify-end">
            <PaginationContent>
                {/* Previous */}
                <PaginationItem>
                    {prevLink.url ? (
                        <PaginationPrevious href={prevLink.url} preserveScroll />
                    ) : (
                        <PaginationPrevious className="pointer-events-none opacity-50" />
                    )}
                </PaginationItem>

                {/* Page Numbers dengan Ellipsis */}
                {visibleIndexes.map((idx, i) => {
                    const prevIdx = visibleIndexes[i - 1];
                    const link = pageLinks[idx];

                    return (
                        <span key={link.label + idx} className="flex items-center">
                            {prevIdx !== undefined && idx - prevIdx > 1 && (
                                <PaginationItem>
                                    <PaginationEllipsis />
                                </PaginationItem>
                            )}

                            <PaginationItem>
                                <PaginationLink
                                    href={link.url ?? "#"}
                                    isActive={link.active}
                                    className={
                                        !link.url ? "pointer-events-none opacity-50" : ""
                                    }
                                    preserveScroll
                                >
                                    {link.label}
                                </PaginationLink>
                            </PaginationItem>
                        </span>
                    );
                })}

                {/* Next */}
                <PaginationItem>
                    {nextLink.url ? (
                        <PaginationNext href={nextLink.url} preserveScroll />
                    ) : (
                        <PaginationNext className="pointer-events-none opacity-50" />
                    )}
                </PaginationItem>
            </PaginationContent>
        </Pagination>
    );
}