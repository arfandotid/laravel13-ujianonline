import { Button } from "@/Components/ui/button";
import { router } from "@inertiajs/react";
import { Trash2 } from "lucide-react";
import Swal from "sweetalert2";

export default function Delete({ URL, id }) {
    const destroy = async (id) => {
        Swal.fire({
            title: "Apakah Anda Yakin?",
            text: "Data yang telah dihapus tidak dapat dikembalikan!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, delete it!",
        }).then((result) => {
            if (result.isConfirmed) {
                router.delete(`${URL}/${id}`);
            }
        });
    };

    return (
        <Button
            size="icon"
            variant="destructive"
            onClick={() => destroy(id)}
            title="Hapus"
        >
            <Trash2 />
        </Button>
    );
}
