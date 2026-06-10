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
    // Pisahkan previous, next, dan page number links
    const prevLink = links[0];
    const nextLink = links[links.length - 1];
    const pageLinks = links.slice(1, -1);

    const currentPage = pageLinks.findIndex((link) => link.active) + 1;
    const totalPages = pageLinks.length;

    // Tentukan halaman mana yang ditampilkan
    const getVisiblePages = () => {
        if (totalPages <= 7) {
            return pageLinks.map((_, i) => i + 1);
        }

        const pages = new Set([1, totalPages]);

        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
            if (i >= 1 && i <= totalPages) pages.add(i);
        }

        return Array.from(pages).sort((a, b) => a - b);
    };

    const visiblePages = getVisiblePages();

    return (
        <Pagination className="flex justify-end">
            <PaginationContent>
                {/* Previous */}
                <PaginationItem>
                    {prevLink.url ? (
                        <PaginationPrevious href={prevLink.url} />
                    ) : (
                        <PaginationPrevious className="pointer-events-none opacity-50" />
                    )}
                </PaginationItem>

                {/* Page Numbers dengan Ellipsis */}
                {visiblePages.map((page, i) => {
                    const prevPage = visiblePages[i - 1];

                    return (
                        <span key={page} className="flex items-center">
                            {/* Tampilkan ellipsis jika ada gap */}
                            {prevPage && page - prevPage > 1 && (
                                <PaginationItem>
                                    <PaginationEllipsis />
                                </PaginationItem>
                            )}

                            <PaginationItem>
                                <PaginationLink
                                    href={pageLinks[page - 1].url ?? "#"}
                                    isActive={pageLinks[page - 1].active}
                                    className={
                                        !pageLinks[page - 1].url
                                            ? "pointer-events-none opacity-50"
                                            : ""
                                    }
                                >
                                    {page}
                                </PaginationLink>
                            </PaginationItem>
                        </span>
                    );
                })}

                {/* Next */}
                <PaginationItem>
                    {nextLink.url ? (
                        <PaginationNext href={nextLink.url} />
                    ) : (
                        <PaginationNext className="pointer-events-none opacity-50" />
                    )}
                </PaginationItem>
            </PaginationContent>
        </Pagination>
    );
}
