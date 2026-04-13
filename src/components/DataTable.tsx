import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { TableData } from "@/lib/xml-utils";

interface DataTableProps {
    data?: TableData | null;
}

const DataTable = ({ data }: DataTableProps) => {

    // 🔐 Safety Guard
    if (!data?.headers?.length || !data?.rows?.length) {
        return (
            <div className="flex h-full items-center justify-center text-muted-foreground p-8 border-2 border-dashed rounded-lg">
                No table data available for this XML.
            </div>
        );
    }

    return (
        <div className="rounded-md border bg-card overflow-x-auto">
            <Table>
                <TableHeader>
                    <TableRow>
                        {data.headers.map((header, index) => (
                            <TableHead key={`header-${index}`} className="font-bold">
                                {header}
                            </TableHead>
                        ))}
                    </TableRow>
                </TableHeader>

                <TableBody>
                    {data.rows.map((row, rowIndex) => (
                        <TableRow key={`row-${rowIndex}`}>
                            {data.headers.map((_, colIndex) => (
                                <TableCell key={`cell-${rowIndex}-${colIndex}`}>
                                    {row?.[colIndex] ?? "-"}
                                </TableCell>
                            ))}
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
};

export default DataTable;