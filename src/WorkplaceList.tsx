import React, { useMemo, useState } from "react";
import { useWorkplaces } from "./WorkplaceContext";
import { useNavigate, Link } from "react-router-dom";

import {
  Button,
  Box,
  Typography,
  TextField,
  Checkbox,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TableContainer,
  Paper,
} from "@mui/material";

import {
  useReactTable,
  getCoreRowModel,
  flexRender,
} from "@tanstack/react-table";

export const WorkplaceList = () => {
  const { workplaces, remove } = useWorkplaces();
  const navigate = useNavigate();

  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState([]);
  const [page, setPage] = useState(1);

  const pageSize = 10;

  const sortedWorkplaces = useMemo(() => {
    return [...workplaces].sort((a, b) => b.id - a.id);
  }, [workplaces]);

  const filteredData = useMemo(() => {
    if (!search.trim()) return sortedWorkplaces;

    return sortedWorkplaces.filter(
      (w) =>
        w.name.toLowerCase().includes(search.toLowerCase()) ||
        w.description?.toLowerCase().includes(search.toLowerCase())
    );
  }, [sortedWorkplaces, search]);

  const totalPages = Math.max(1, Math.ceil(filteredData.length / pageSize));
  const paginatedData = filteredData.slice(
    (page - 1) * pageSize,
    page * pageSize
  );

  const toggleRow = (id) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const deleteSelected = () => {
    selected.forEach((id) => remove(id));
    setSelected([]);
  };

  const columns = useMemo(
    () => [
      {
        id: "select",
        header: (
          <Checkbox
            indeterminate={
              selected.length > 0 && selected.length < paginatedData.length
            }
            checked={
              paginatedData.length > 0 &&
              selected.length === paginatedData.length
            }
            onChange={(e) => {
              if (e.target.checked) {
                setSelected(paginatedData.map((w) => w.id));
              } else {
                setSelected([]);
              }
            }}
          />
        ),
        cell: ({ row }) => (
          <Checkbox
            checked={selected.includes(row.original.id)}
            onChange={() => toggleRow(row.original.id)}
          />
        ),
      },
      {
        accessorKey: "name",
        header: "Название",
        cell: ({ row }) => (
          <Link to={`/workplace/${row.original.id}`}>{row.original.name}</Link>
        ),
      },
      {
        accessorKey: "description",
        header: "Описание",
      },
      {
        accessorKey: "hasComputer",
        header: "Место с компьютером",
        cell: ({ row }) => (row.original.hasComputer ? "Да" : "Нет"),
      },
      {
        accessorKey: "ip",
        header: "IP",
        cell: ({ row }) => (row.original.hasComputer ? row.original.ip : "—"),
      },
    ],
    [selected, paginatedData]
  );

  const table = useReactTable({
    data: paginatedData,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <Box p={3}>
      <Box
        sx={{
          position: "sticky",
          top: 0,
          zIndex: 10,
          backgroundColor: "white",
          pb: 2,
          pt: 2,
        }}
      >
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          mb={2}
          gap={2}
        >
          <Typography variant="h5">Рабочие места</Typography>

          <Box display="flex" gap={2}>
            <Button
              variant="contained"
              color="error"
              disabled={selected.length === 0}
              onClick={deleteSelected}
            >
              Удалить
            </Button>

            <Button variant="contained" onClick={() => navigate("/create")}>
              Создать
            </Button>
          </Box>
        </Box>

        <TextField
          label="Введите название рабочего места..."
          fullWidth
          variant="outlined"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          sx={{ mb: 2 }}
        />
      </Box>

      {/* ---- TABLE ---- */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableCell key={header.id}>
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableHead>

          <TableBody>
            {table.getRowModel().rows.map((row) => (
              <TableRow key={row.id} hover>
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))}

            {table.getRowModel().rows.length === 0 && (
              <TableRow>
                <TableCell colSpan={columns.length} align="center">
                  Ничего не найдено
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Box mt={2} display="flex" justifyContent="center" gap={2}>
        <Button
          variant="outlined"
          disabled={page === 1}
          onClick={() => setPage((p) => p - 1)}
        >
          Назад
        </Button>

        <Typography sx={{ display: "flex", alignItems: "center" }}>
          Страница {page} из {totalPages}
        </Typography>

        <Button
          variant="outlined"
          disabled={page === totalPages}
          onClick={() => setPage((p) => p + 1)}
        >
          Вперёд
        </Button>
      </Box>
    </Box>
  );
};
