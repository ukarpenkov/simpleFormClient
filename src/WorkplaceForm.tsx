import { useState, useEffect } from "react";
import {
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  TextField,
  Typography,
} from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import { useWorkplaces } from "./WorkplaceContext";
import { toast } from "react-toastify";

export const WorkplaceForm = () => {
  const { id } = useParams();
  const numericId = Number(id);

  const { workplaces, create, update } = useWorkplaces();
  const navigate = useNavigate();

  const editing = Boolean(id);
  const existing = workplaces.find((w) => w.id === numericId);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [hasComputer, setHasComputer] = useState(false);
  const [ip, setIp] = useState("");

  useEffect(() => {
    if (existing) {
      setName(existing.name);
      setDescription(existing.description);
      setHasComputer(existing.hasComputer);
      setIp(existing.ip || "");
    }
  }, [existing]);

  const isNameEmpty = name.trim() === "";

  const nameExists = workplaces.some(
    (w) =>
      w.name.trim().toLowerCase() === name.trim().toLowerCase() &&
      w.id !== numericId
  );

  const handleSubmit = () => {
    if (isNameEmpty) {
      toast.error("Введите наименование!");
      return;
    }

    if (nameExists) {
      toast.error("Рабочее место с таким именем уже существует!");
      return;
    }

    const data = {
      name,
      description,
      hasComputer,
      ip: hasComputer ? ip : "",
    };

    if (editing) update(numericId, data);
    else create(data);

    navigate("/");
  };

  return (
    <Box
      display="flex"
      alignItems="center"
      justifyContent="center"
      minHeight="100vh"
    >
      <Box p={3} width={400}>
        <Typography variant="h5" mb={2} textAlign="center">
          {editing
            ? "Редактирование рабочего места"
            : "Создание рабочего места"}
        </Typography>

        <Box display="flex" flexDirection="column" gap={2}>
          <TextField
            label="Наименование"
            value={name}
            required
            error={isNameEmpty}
            helperText={isNameEmpty ? "Поле обязательно" : ""}
            onChange={(e) => setName(e.target.value)}
          />

          <TextField
            label="Описание"
            value={description}
            multiline
            onChange={(e) => setDescription(e.target.value)}
          />

          <FormControlLabel
            control={
              <Checkbox
                checked={hasComputer}
                onChange={(e) => setHasComputer(e.target.checked)}
              />
            }
            label="Место с компьютером"
          />

          {hasComputer && (
            <TextField
              label="IP-адрес"
              value={ip}
              onChange={(e) => setIp(e.target.value)}
            />
          )}

          <Button
            variant="contained"
            onClick={handleSubmit}
            disabled={isNameEmpty}
          >
            Сохранить
          </Button>

          <Button variant="text" onClick={() => navigate("/")}>
            Отмена
          </Button>
        </Box>
      </Box>
    </Box>
  );
};
