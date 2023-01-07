import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import TextField from "@mui/material/TextField";
import CloseIcon from "@mui/icons-material/Close";
import IconButton from "@mui/material/IconButton";
import Button from "@mui/material/Button";
import { Alert, Autocomplete, DialogActions, Snackbar } from "@mui/material";
import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import {
  createThread,
  editThread,
  Thread,
  threadsErrorNoted,
} from "./threadSlice";
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
  const [title, setTitle]: [string, Function] = useState(thread.title);
  const [tag, setTag]: [string, Function] = useState(thread.tag);
  const [content, setContent]: [string, Function] = useState(thread.content);
  const [image, setImage]: [string | null, Function] = useState<string | null>(
    thread.image
  );
  const [snackbarOpen, setSnackbarOpen]: [boolean, Function] = useState(false);
  const threadsError: string | null = useAppSelector(
    (state) => state.thread.error
  );

  //Throws error if image is too large
  useEffect(() => {
    if (threadsError !== null) {
      setSnackbarOpen(true);
      dispatch(threadsErrorNoted());
    }
  }, [threadsError, dispatch]);

  //Ensures that threadAdd is always up to date with the threads
  useEffect(() => {
    setTitle(thread.title);
    setTag(thread.tag);
    setContent(thread.content);
    setImage(thread.image);
  }, [thread]);

  return (
    <>
      <Dialog open={dialogOpen}>
        <DialogTitle
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          {create ? "Create a New Thread" : "Edit Thread"}
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

          <Autocomplete
            options={[
              "Education",
              "Work",
              "Social Life",
              "Philosophy",
              "Culture",
              "Politics",
              "Miscellaneous",
            ]}
            value={tag}
            onChange={(_, newTag: string | null) => setTag(newTag)}
            disablePortal
            renderInput={(params) => (
              <TextField {...params} required label="Tag" />
            )}
            fullWidth
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
            Upload Image (maximum size 2.5mb)
          </Button>
          <IconButton sx={{ color: "#ED4337" }} onClick={() => setImage(null)}>
            <Delete />
          </IconButton>
          <br />
          {image && <img src={image} alt={title} width={400} height={"auto"} />}
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

              dispatch(
                create ? createThread(threadNew) : editThread(threadNew)
              );
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
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={() => setSnackbarOpen(false)}
      >
        <Alert onClose={() => setSnackbarOpen(false)} severity="error">
          Maximum image size is 2.5MB. Please compress image.
        </Alert>
      </Snackbar>
    </>
  );
}
