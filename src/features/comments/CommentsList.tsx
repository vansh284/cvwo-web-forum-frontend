import { Box, Button, CircularProgress, Divider, Paper } from "@mui/material";
import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { RootState } from "../../app/store";
import { Comment, getCommentList, selectCommentList } from "./commentSlice";
import { selectUsername } from "../user/userSlice";
import { CommentC } from "./CommentC";
import { CommentAdd } from "./CommentAdd";

export function CommentList({ ID }: { ID: Number }) {
  const commentList: Comment[] = useAppSelector(selectCommentList);
  const commentsStatus: string = useAppSelector(
    (state: RootState) => state.comment.statusGet
  );
  const commentsError: string | null = useAppSelector(
    (state: RootState) => state.comment.error
  );
  const currentUser: string = useAppSelector(selectUsername);
  const dispatch = useAppDispatch();
  const [commentOpen, setCommentOpen] = useState(false);

  //Get the comments
  useEffect(() => {
    if (commentsStatus === "idle") {
      dispatch(getCommentList(ID));
    }
  }, [commentsStatus, commentsError]);

  return (
    <>
      {commentsStatus === "pending" ? (
        <Box
          sx={{ display: "flex", justifyContent: "center", padding: "150px 0" }}
        >
          <CircularProgress size={60} />
        </Box>
      ) : (
        <>
          <h2 style={{fontWeight:"bold"}}>Comments Section</h2>
          <Button
            variant="outlined"
            onClick={() => setCommentOpen(true)}
            sx={{ marginBottom: "20px" }}
          >
            Comment
          </Button>
          <Divider />
          {commentList.length > 0 ? (
            commentList.map((comment: Comment) => (
              <CommentC key={comment.ID?.toString()} comment={comment} />
            ))
          ) : (
            <p>No comments yet. Be the first to comment !</p>
          )}
          {commentOpen && (
            <CommentAdd
              dialogOpen={commentOpen}
              setDialogOpen={setCommentOpen}
              comment={{ thread_id: ID, content: "", author: currentUser }}
              create={true}
            />
          )}
        </>
      )}
    </>
  );
}
