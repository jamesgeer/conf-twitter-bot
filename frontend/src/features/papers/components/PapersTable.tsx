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
import PapersTableExpanded from './PapersTableExpanded';
import uuid from 'react-uuid';

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
					{row.getIsExpanded() ? (
						<IconCircleMinus className="min-w-[25px] mr-2" />
					) : (
						<IconCirclePlus className="min-w-[25px] mr-2" />
					)}{' '}
					<Text as="span" fontWeight="bold">
						{getValue()}
					</Text>
				</Box>
			),
		}),
		columnHelper.accessor('authors', {
			header: 'Authors',
			cell: ({ getValue }) => getValue().join(', '),
		}),
		columnHelper.accessor('citations', {
			header: 'Cites',
		}),
		columnHelper.accessor('downloads', {
			header: '#Down',
		}),
	];

	const data = useMemo(() => papers, [papers]);
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
		<Tr key={uuid()}>
			{headerGroup.headers.map((header) => {
				return (
					<Th key={uuid()} colSpan={header.colSpan}>
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
					key={uuid()}
					onClick={() => handleRowClick(row)}
					className="cursor-pointer hover:bg-[color:var(--chakra-colors-gray-100)]"
				>
					{row.getVisibleCells().map((cell) => {
						return <Td key={uuid()}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</Td>;
					})}
				</Tr>
				{row.getIsExpanded() ? (
					<Tr key={uuid()}>
						<Td colSpan={headers.length}>
							<PapersTableExpanded paper={row.original} />
						</Td>
					</Tr>
				) : null}
			</>
		);
	});

	return (
		<Table>
			<Thead>{tableHeaders}</Thead>
			<Tbody>{tableData}</Tbody>
		</Table>
	);
};

export default PapersTable;
