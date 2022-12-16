import { Avatar, Card, CardActionArea, CardActions, CardContent, CardHeader, Chip, IconButton, Stack, Tooltip } from "@mui/material";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { selectUsername } from "../user/userSlice";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { Thread } from "./threadSlice";

export function ThreadExcerpt({ thread }: { thread: Thread }) {
  const dispatch = useAppDispatch();

  const currentUser: string = useAppSelector(selectUsername);
  return (
    <Card
      key={thread.ID?.toString()}
      variant="elevation"
      elevation={10}
      onClick={() => {
        console.log("hi");
      }}
    >
      <CardActionArea>
        <Stack direction="row">
          <CardHeader
            avatar={
              <Avatar sx={{ bgcolor: "blueviolet" }}>
                {thread.author.substring(0, 1).toUpperCase()}
              </Avatar> //randomise color or base on username characters
            }
            title={thread.title}
            subheader={thread.CreatedAt}
          ></CardHeader>
          <Chip
            label={thread.tag}
            variant="outlined"
            color="primary"
            sx={{ margin: "20px" }}
          />
        </Stack>
        <CardContent>{thread.content}</CardContent>
      </CardActionArea>
      {currentUser === thread.author && (
        <CardActions disableSpacing>
          <Tooltip title="Edit">
            <IconButton onClick={() => {}} sx={{ marginLeft: "auto" }}>
              <EditIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Delete">
            <IconButton onClick={() => {}}>
              <DeleteIcon />
            </IconButton>
          </Tooltip>
        </CardActions>
      )}
    </Card>
  );
}
