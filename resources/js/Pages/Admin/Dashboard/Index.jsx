import { Head } from "@inertiajs/react";
import LayoutApp from "@/Layouts/LayoutApp";
import PageHeader from "@/Components/common/PageHeader";

export default function Dashboard() {
    return (
        <>
            <Head title="Dashboard" />
            <LayoutApp>
                <PageHeader
                    showButton={false}
                    title="Dashboard"
                    description="Halaman dashboard"
                />
            </LayoutApp>
        </>
    );
}
