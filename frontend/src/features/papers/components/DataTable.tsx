import { Table, Thead, Tbody, Tr, Th, Td, chakra } from '@chakra-ui/react';
import { IconTriangle, IconTriangleInverted } from '@tabler/icons';
import {
	useReactTable,
	flexRender,
	getCoreRowModel,
	ColumnDef,
	SortingState,
	getSortedRowModel,
} from '@tanstack/react-table';
import { useState } from 'react';

export type DataTableProps<Data extends object> = {
	data: Data[];
	columns: ColumnDef<Data, any>[];
};

export function DataTable<Data extends object>({ data, columns }: DataTableProps<Data>) {
	const [sorting, setSorting] = useState<SortingState>([]);
	const table = useReactTable({
		columns,
		data,
		getCoreRowModel: getCoreRowModel(),
		onSortingChange: setSorting,
		getSortedRowModel: getSortedRowModel(),
		state: {
			sorting,
		},
	});

	if (data === undefined || data.length === 0) {
		return <p>No results found.</p>;
	}

	return (
		<Table>
			<Thead>
				{table.getHeaderGroups().map((headerGroup) => (
					<Tr key={headerGroup.id}>
						{headerGroup.headers.map((header) => {
							// see https://tanstack.com/table/v8/docs/api/core/column-def#meta to type this correctly
							const meta: any = header.column.columnDef.meta;
							return (
								<Th
									cursor={'pointer'}
									key={header.id}
									onClick={header.column.getToggleSortingHandler()}
									isNumeric={meta?.isNumeric}
								>
									{flexRender(header.column.columnDef.header, header.getContext())}

									<chakra.span pl="4">
										{header.column.getIsSorted() ? (
											header.column.getIsSorted() === 'desc' ? (
												<IconTriangle aria-label="sorted descending" />
											) : (
												<IconTriangleInverted aria-label="sorted ascending" />
											)
										) : null}
									</chakra.span>
								</Th>
							);
						})}
					</Tr>
				))}
			</Thead>
			<Tbody>
				{table.getRowModel().rows.map((row) => (
					<Tr key={row.id}>
						{row.getVisibleCells().map((cell) => {
							// see https://tanstack.com/table/v8/docs/api/core/column-def#meta to type this correctly
							const meta: any = cell.column.columnDef.meta;
							return (
								<Td key={cell.id} isNumeric={meta?.isNumeric}>
									{flexRender(cell.column.columnDef.cell, cell.getContext())}
								</Td>
							);
						})}
					</Tr>
				))}
			</Tbody>
		</Table>
	);
}
