import {
  Avatar,
  Button,
  CardContent,
  CardHeader,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Grid,
  IconButton,
  Tooltip,
} from "@mui/material";
import { Comment, deleteComment } from "./commentSlice";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { useState } from "react";
import { CommentAdd } from "./CommentAdd";
import { selectUsername } from "../user/userSlice";
import { Box } from "@mui/system";
import { timeToTimeAgo } from "../../app/time";

export function CommentC({ comment }: { comment: Comment }) {
  const currentUser: string = useAppSelector(selectUsername);
  const dispatch = useAppDispatch();
  const [deleteDialogOpen, setDeleteDialogOpen]: [boolean, Function] =
    useState(false);
  const [editDialogOpen, setEditDialogOpen]: [boolean, Function] =
    useState(false);

  return (
    <>
      <Grid container spacing={2} wrap="nowrap" key={comment.ID?.toString()}>
        <Grid item sx={{ marginTop: "10px" }}>
          <Avatar sx={{ bgcolor: "blueviolet" }}>
            {comment.author.substring(0, 1).toUpperCase()}
          </Avatar>
        </Grid>
        <Grid item xs={10}>
          <Grid container spacing={2} wrap="nowrap">
            <Grid item>
        <CardHeader
          titleTypographyProps={{
            fontSize: "24px",
            fontWeight: "bold",
            fontFamily: "Georgia, 'Times New Roman', Times, serif",
          }}
          title={comment.author}
        />
            </Grid>
            <Grid item>
              <CardHeader
                subheader={
                  comment.CreatedAt ? timeToTimeAgo(comment.CreatedAt) : null
                }
              />
            </Grid>
          </Grid>
          <CardContent className="CardContent">{comment.content}</CardContent>
        </Grid>
        {comment.author === currentUser && (
          <Box display="flex" flexDirection="column" justifyContent="flex-end">
            <Grid item>
              <Tooltip title="Edit">
                <IconButton
                  onClick={() => {
                    setEditDialogOpen(true);
                  }}
                  sx={{ marginLeft: "auto" }}
                >
                  <EditIcon />
                </IconButton>
              </Tooltip>
              <Tooltip title="Delete">
                <IconButton onClick={() => setDeleteDialogOpen(true)}>
                  <DeleteIcon />
                </IconButton>
              </Tooltip>
            </Grid>
          </Box>
        )}
      </Grid>
      <Divider />
      <CommentAdd
        dialogOpen={editDialogOpen}
        setDialogOpen={setEditDialogOpen}
        comment={comment}
        create={false}
      />
      <Dialog open={deleteDialogOpen}>
        <DialogTitle>Delete this Comment?</DialogTitle>
        <DialogContent>This cannot be undone.</DialogContent>
        <DialogActions>
          <Button
            variant="contained"
            sx={{ bgcolor: "#ED4337" }}
            onClick={() => dispatch(deleteComment(comment))}
          >
            Yes
          </Button>
          <Button variant="outlined" onClick={() => setDeleteDialogOpen(false)}>
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
