import { Link } from "@inertiajs/react";
import { Plus } from "lucide-react";
import hasAnyPermission from "@/utils/permissions";
import { Button } from "@/Components/ui/button";

export default function PageHeader({
    showButton,
    title,
    description,
    action,
    actionText,
    permission,
}) {
    return (
        <div className="flex flex-row items-center justify-between">
            <div>
                <h1 className="scroll-m-20 text-2xl font-semibold tracking-tight">
                    {title}
                </h1>
                <p className="text-sm text-muted-foreground">{description}</p>
            </div>

            {showButton && permission && (
                <div className="mt-4 sm:mt-0">
                    {hasAnyPermission(permission) && (
                        <Link href={action}>
                            <Button>
                                <Plus className="w-5 h-5 mr-2" />
                                {actionText}
                            </Button>
                        </Link>
                    )}
                </div>
            )}
        </div>
    );
}
