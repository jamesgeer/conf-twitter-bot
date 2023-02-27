import { Table, Thead, Tbody, Tr, Th, Td, Box, Text } from '@chakra-ui/react';
import { IconCirclePlus, IconCircleMinus } from '@tabler/icons';

import {
	useReactTable,
	flexRender,
	getCoreRowModel,
	SortingState,
	getSortedRowModel,
	createColumnHelper,
	Row,
} from '@tanstack/react-table';

import React, { useMemo, useState } from 'react';
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
				<Box className="flex items-center">
					{row.getIsExpanded() ? <IconCircleMinus className="mr-2" /> : <IconCirclePlus className="mr-2" />}{' '}
					<Text as="span" fontWeight="bold">
						{getValue()}
					</Text>
				</Box>
			),
		}),
	];

	const data = useMemo(() => papers, []);
	const columns = useMemo(() => headers, []);

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

	const tableHeaders = table.getHeaderGroups().map((headerGroup) => (
		<Tr key={headerGroup.id}>
			{headerGroup.headers.map((header) => {
				return (
					<Th key={header.id} colSpan={header.colSpan}>
						{header.isPlaceholder ? null : (
							<Box
								{...{
									className: header.column.getCanSort() ? 'cursor-pointer select-none' : '',
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
	));

	const handleRowClick = (row: Row<Paper>) => {
		row.toggleExpanded();
	};

	const tableData = table.getRowModel().rows.map((row) => {
		return (
			<>
				<Tr
					key={row.id}
					onClick={() => handleRowClick(row)}
					className="cursor-pointer hover:bg-[color:var(--chakra-colors-gray-100)]"
				>
					{row.getVisibleCells().map((cell) => {
						return <Td key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</Td>;
					})}
				</Tr>
				{row.getIsExpanded() ? (
					<Tr>
						<Td>{row.original.shortAbstract}</Td>
					</Tr>
				) : null}
			</>
		);
	});

	return (
		<>
			<Table>
				<Thead>{tableHeaders}</Thead>
				<Tbody>{tableData}</Tbody>
			</Table>
		</>
	);
};

export default PapersTable;
