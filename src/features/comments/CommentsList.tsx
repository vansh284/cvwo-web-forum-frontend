import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { RootState } from "../../app/store";
import { Comment, createComment, getCommentList, selectCommentList } from "./commentSlice";

export function CommentC({ comment }: { comment: Comment }) {
  return (
    <div className="thread" key={comment.ID?.toString()}>
      <h1>{comment.author}</h1>
      <p>{comment.content}</p>
      <p>{comment.CreatedAt}</p>
    </div>
  );
}

export function CommentList({ ID }: { ID: string }) {
  const commentList: Comment[] = useAppSelector(selectCommentList);
  const commentsStatus: string = useAppSelector(
    (state: RootState) => state.comment.statusGet
  );
  const commentsError: string | null = useAppSelector(
    (state: RootState) => state.comment.error
  );
  const dispatch = useAppDispatch();
  useEffect(() => {
    if (commentsStatus == "idle") {
      dispatch(getCommentList(ID));
    }
  }, [commentsStatus, commentsError]);
  return (
    <section>
      <h2>Comments</h2>
      {commentList.map((comment: Comment) => (
        <CommentC key={comment.ID?.toString()} comment={comment} />
      ))}
      <button onClick={() => dispatch(createComment({content: "front end works", thread_id: 11, author: "John Doe"}))}>Comment</button>
    </section>
  );
}
