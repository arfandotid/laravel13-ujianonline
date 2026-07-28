export function Table({ children, className = "", ...rest }) {
    return (
        <div
            className={`${className} overflow-x-auto border border-gray-200 dark:border-neutral-800 rounded-lg`}
            {...rest}
        >
            <table className="min-w-full divide-y divide-gray-200 dark:divide-neutral-700">
                {children}
            </table>
        </div>
    );
}

export function TableHeader({ children, className = "", ...rest }) {
    return (
        <thead
            className={`${className} bg-gray-50 dark:bg-neutral-800`}
            {...rest}
        >
            {children}
        </thead>
    );
}

export function TableBody({ children, className = "", ...rest }) {
    return (
        <tbody
            className={`${className} bg-white dark:bg-neutral-900 divide-y divide-gray-200 dark:divide-neutral-700`}
            {...rest}
        >
            {children}
        </tbody>
    );
}

export function TableRow({ children, className = "", ...rest }) {
    return (
        <tr className={`${className}`} {...rest}>
            {children}
        </tr>
    );
}

export function TableHead({ children, className = "", ...rest }) {
    return (
        <th
            className={`${className} px-6 py-2 text-left text-xs font-semibold text-gray-700 dark:text-gray-50 uppercase`}
            {...rest}
        >
            {children}
        </th>
    );
}

export function TableCell({ children, className = "", ...rest }) {
    return (
        <td
            className={`px-6 py-2 text-sm text-gray-900 dark:text-gray-50 ${className}`}
            {...rest}
        >
            {children}
        </td>
    );
}
