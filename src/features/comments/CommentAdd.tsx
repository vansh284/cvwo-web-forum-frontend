import {
  Avatar,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
  TextField,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useAppDispatch } from "../../app/hooks";
import { Comment, createComment, editComment } from "./commentSlice";
import CloseIcon from "@mui/icons-material/Close";
import stc from "string-to-color";

export function CommentAdd({
  dialogOpen,
  setDialogOpen,
  comment,
  create,
}: {
  dialogOpen: boolean;
  setDialogOpen: Function;
  comment: Comment;
  create: boolean;
}) {
  const dispatch = useAppDispatch();
  const [content, setContent]: [string, Function] = useState(comment.content);

  //Ensures that comment add is always up to date with comments
  useEffect(() => {
    setContent(comment.content);
  }, [content]);

  return (
    <Dialog open={dialogOpen}>
      <DialogTitle
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        Add a New Comment
        <IconButton onClick={() => setDialogOpen(false)}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <Grid container wrap="nowrap" spacing={2}>
          <Grid item>
            <Avatar sx={{ bgcolor: stc(comment.author), margin: "10px" }}>
              {comment.author.substring(0, 1).toUpperCase()}
            </Avatar>
          </Grid>
          <Grid item>
            <TextField
              autoFocus
              margin="dense"
              placeholder="What do you think of this thread?"
              type="text"
              fullWidth
              variant="outlined"
              value={content}
              multiline
              minRows={2}
              onChange={(
                e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
              ) => setContent(e.target.value)}
              required
            />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button
          variant="contained"
          onClick={() => {
            const commentNew: Comment = {
              ID: comment.ID,
              thread_id: comment.thread_id,
              CreatedAt: comment.CreatedAt,
              content: content,
              author: comment.author,
            };

            dispatch(
              create ? createComment(commentNew) : editComment(commentNew)
            );
            setContent("");
            setDialogOpen(false);
          }}
          disabled={content.length === 0}
          fullWidth
        >
          Post
        </Button>
      </DialogActions>
    </Dialog>
  );
}
