import { Table, Thead, Tbody, Tr, Th, Td, chakra, Box } from '@chakra-ui/react';

import {
	useReactTable,
	flexRender,
	getCoreRowModel,
	SortingState,
	getSortedRowModel,
	createColumnHelper,
} from '@tanstack/react-table';

import { useMemo, useState } from 'react';
import { Paper, Papers } from '../types';

interface Props {
	papers: Papers;
}

const PapersTable = ({ papers }: Props) => {
	const [sorting, setSorting] = useState<SortingState>([]);

	const columnHelper = createColumnHelper<Paper>();

	const headers = [
		columnHelper.accessor('title', {
			header: 'Title',
			cell: ({ row, getValue }) => (
				<>
					<button
						{...{
							onClick: () => row.toggleExpanded(),
							style: { cursor: 'pointer' },
						}}
					>
						{row.getIsExpanded() ? '👇' : '👉'}
					</button>{' '}
					{getValue()}
				</>
			),
		}),
	];

	const columns = useMemo(() => headers, []);
	const data = useMemo(() => papers, []);

	const table = useReactTable({
		data,
		columns,
		state: {
			sorting,
		},
		onSortingChange: setSorting,
		getCoreRowModel: getCoreRowModel(),
		getSortedRowModel: getSortedRowModel(),
		debugTable: true,
	});

	return (
		<>
			<Table>
				<Thead>
					{table.getHeaderGroups().map((headerGroup) => (
						<Tr key={headerGroup.id}>
							{headerGroup.headers.map((header) => {
								return (
									<Th key={header.id} colSpan={header.colSpan}>
										{header.isPlaceholder ? null : (
											<Box
												{...{
													className: header.column.getCanSort()
														? 'cursor-pointer select-none'
														: '',
													onClick: header.column.getToggleSortingHandler(),
												}}
											>
												{flexRender(header.column.columnDef.header, header.getContext())}
												{{
													asc: ' 🔼',
													desc: ' 🔽',
												}[header.column.getIsSorted() as string] ?? null}
											</Box>
										)}
									</Th>
								);
							})}
						</Tr>
					))}
				</Thead>
				<Tbody>
					{table.getRowModel().rows.map((row) => {
						return (
							<>
								<Tr key={row.id}>
									{row.getVisibleCells().map((cell) => {
										return (
											<Td key={cell.id}>
												{flexRender(cell.column.columnDef.cell, cell.getContext())}
											</Td>
										);
									})}
								</Tr>
								{row.getIsExpanded() ? (
									<Tr>
										<Td>{row.original.shortAbstract}</Td>
									</Tr>
								) : null}
							</>
						);
					})}
				</Tbody>
			</Table>
		</>
	);
};

export default PapersTable;
