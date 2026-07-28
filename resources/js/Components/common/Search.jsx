import { useState, useEffect } from "react";
import { router, usePage } from "@inertiajs/react";
import { Search } from "lucide-react";
import { Input } from "@/Components/ui/input";
import { Button } from "@/Components/ui/button";

export default function SearchComponent({ URL }) {
    const { url } = usePage();

    const getQueryParam = (param) => {
        const params = new URLSearchParams(window.location.search);
        return params.get(param) || "";
    };

    const [search, setSearch] = useState(getQueryParam("q"));

    useEffect(() => {
        setSearch(getQueryParam("q"));
    }, [url]);

    const handleSearch = (e) => {
        e.preventDefault();
        router.get(`${URL}?q=${search}`);
    };

    return (
        <form onSubmit={handleSearch} className="space-y-4">
            <div className="flex flex-col md:flex-row md:items-center md:space-x-4">
                <div className="flex-1">
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                            <Search className="w-5 h-5 text-gray-400" />
                        </div>
                        <Input
                            type="search"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Cari data..."
                            className="w-full pl-10 pr-4 py-2.5 text-sm bg-gray-50 border rounded-lg focus:outline-none transition-all duration-200"
                        />
                    </div>
                </div>
                <div className="flex space-x-3 mt-3 md:mt-0">
                    <Button type="submit">
                        <Search className="w-4 h-4 inline mr-2" />
                        Search
                    </Button>
                </div>
            </div>
        </form>
    );
}
