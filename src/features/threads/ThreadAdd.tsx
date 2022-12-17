import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import TextField from "@mui/material/TextField";
import CloseIcon from "@mui/icons-material/Close";
import IconButton from "@mui/material/IconButton";
import Button from "@mui/material/Button";
import { DialogActions } from "@mui/material";
import { useState } from "react";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { createThread, editThread, Thread } from "./threadSlice";
import { selectUsername } from "../user/userSlice";
import Delete from "@mui/icons-material/Delete";

export function ThreadAdd({
  dialogOpen,
  setDialogOpen,
  thread,
  create,
}: {
  dialogOpen: boolean;
  setDialogOpen: Function;
  thread: Thread;
  create: boolean;
}) {
  const dispatch = useAppDispatch();
  const [title, setTitle] = useState(thread.title);
  const [tag, setTag] = useState(thread.tag);
  const [content, setContent] = useState(thread.content);
  const [image, setImage] = useState<string | null>(thread.image);
  return (
    <Dialog open={dialogOpen}>
      <DialogTitle
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        Create a New Thread
        <IconButton onClick={() => setDialogOpen(false)}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          label="Title"
          type="text"
          fullWidth
          variant="outlined"
          value={title}
          onChange={(
            e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
          ) => setTitle(e.target.value)}
          required
        />
        <TextField
          autoFocus
          margin="dense"
          label="Tag"
          type="text"
          fullWidth
          variant="outlined"
          value={tag}
          onChange={(
            e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
          ) => setTag(e.target.value)}
          required
        />
        <TextField
          autoFocus
          margin="dense"
          label="Content"
          type="text"
          fullWidth
          variant="outlined"
          value={content}
          onChange={(
            e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
          ) => setContent(e.target.value)}
          multiline
          minRows={3}
          required
        />
        <Button
          sx={{ marginTop: "10px", marginBottom: "10px" }}
          variant="outlined"
          component="label"
        >
          <input
            accept="image/*"
            hidden
            type="file"
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              if (e.target.files) {
                const reader = new FileReader();
                reader.addEventListener("load", () =>
                  setImage(
                    typeof reader.result === "string" ? reader.result : null
                  )
                );
                reader.readAsDataURL(e.target.files[0]);
              }
            }}
          />
          Upload Image
        </Button>
        <IconButton sx={{ color: "#ED4337" }} onClick={() => setImage(null)}>
          <Delete />
        </IconButton>
        <br />
        {image && <img src={image} width={400} height={"auto"} />}
      </DialogContent>
      <DialogActions>
        <Button
          variant="contained"
          onClick={() => {
            const threadNew: Thread = {
              ID: thread.ID,
              CreatedAt: thread.CreatedAt,
              title: title,
              tag: tag,
              content: content,
              author: thread.author,
              image: image,
            };

            dispatch(create ? createThread(threadNew) : editThread(threadNew));
            setTitle("");
            setContent("");
            setTag("");
            setImage(null);
            setDialogOpen(false);
          }}
          disabled={
            title.length === 0 || content.length === 0 || tag.length === 0
          }
          fullWidth
        >
          Post
        </Button>
      </DialogActions>
    </Dialog>
  );
}
