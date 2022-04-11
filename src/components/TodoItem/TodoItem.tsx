import { Box, Button, Grid, Text } from "@mantine/core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { TodoItemProps } from "./types";

export const TodoItem = ({
  completed,
  disabled,
  id,
  onDone,
  onDelete,
  text,
}: TodoItemProps) => {
  return (
    <Box id={id} className="todo-item" data-text={text} p="md">
      <Grid>
        <Grid.Col span={10} sx={{ display: "flex", alignItems: "center" }}>
          <Text
            className="todo-text"
            data-completed={completed}
            sx={{ ...(completed && { textDecoration: "line-through" }) }}
          >
            {text}
          </Text>
        </Grid.Col>
        <Grid.Col span={2}>
          <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
            <Button
              className="check-button"
              variant="outline"
              color="green"
              mr="sm"
              onClick={onDone}
              disabled={disabled}
            >
              <FontAwesomeIcon icon="check" />
            </Button>
            <Button
              className="delete-button"
              variant="outline"
              color="red"
              onClick={onDelete}
              disabled={disabled}
            >
              <FontAwesomeIcon icon="times" />
            </Button>
          </Box>
        </Grid.Col>
      </Grid>
    </Box>
  );
};
