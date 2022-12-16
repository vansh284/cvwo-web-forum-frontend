import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import TextField from "@mui/material/TextField";
import CloseIcon from "@mui/icons-material/Close";
import IconButton from "@mui/material/IconButton";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import { DialogActions } from "@mui/material";
import { useState } from "react";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { createThread } from "./threadSlice";
import { selectUsername } from "../user/userSlice";
import Delete from "@mui/icons-material/Delete";

export function ThreadAdd({
  threadAddOpen,
  setThreadAddOpen,
}: {
  threadAddOpen: boolean;
  setThreadAddOpen: Function;
}) {
  const dispatch = useAppDispatch();
  const author = useAppSelector(selectUsername);
  const [title, setTitle] = useState("");
  const [tag, setTag] = useState("");
  const [content, setContent] = useState("");
  const [image, setImage] = useState<null | File>(null);
  return (
    <Dialog open={threadAddOpen}>
      <DialogTitle
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        Create a New Thread
        <IconButton onClick={() => setThreadAddOpen(false)}>
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
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              e.target.files ? setImage(e.target.files[0]) : null
            }
          />
          Upload Image
        </Button>
        <IconButton sx={{color:"#ED4337"}} onClick={() => setImage(null)}>
            <Delete />
        </IconButton>
        <br />
        {image && (
          <img
            src={image ? URL.createObjectURL(image) : undefined}
            width={400}
            height={"auto"}
          />
        )}
      </DialogContent>
      <DialogActions>
        <Button
          variant="contained"
          onClick={() => {
            dispatch(
              createThread({
                title: title,
                tag: tag,
                content: content,
                author: author,
              })
            );
            setThreadAddOpen(false);
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
