import { Link, usePage } from "@inertiajs/react";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "../ui/breadcrumb";
import { Fragment } from "react";

export default function NavBreadcrumb() {
    // breadcrumb logic
    const { url } = usePage();
    const segments = url.split("?")[0].split("/").filter(Boolean);

    // filter segments untuk menghilangkan segment yang hanya angka (id)
    const filteredSegments = segments.filter(
        (segment) => !/^\d+$/.test(segment),
    );

    return (
        <Breadcrumb>
            <BreadcrumbList>
                {/* Home */}
                <BreadcrumbItem className="hidden md:block">
                    <BreadcrumbLink asChild>
                        <Link href="/admin/dashboard">Home</Link>
                    </BreadcrumbLink>
                </BreadcrumbItem>

                {filteredSegments.map((segment, index) => {
                    const isLast = index === filteredSegments.length - 1;

                    const label =
                        segment.charAt(0).toUpperCase() +
                        segment.slice(1).replace("-", " ");

                    return (
                        <Fragment key={index}>
                            <BreadcrumbSeparator className="hidden md:block" />

                            <BreadcrumbItem className="hidden md:block">
                                {isLast ? (
                                    <BreadcrumbPage>{label}</BreadcrumbPage>
                                ) : (
                                    <BreadcrumbPage className="text-muted-foreground">
                                        {label}
                                    </BreadcrumbPage>
                                )}
                            </BreadcrumbItem>
                        </Fragment>
                    );
                })}
            </BreadcrumbList>
        </Breadcrumb>
    );
}
