import { useParams } from "react-router-dom";
import { useAppSelector } from "../../app/hooks";
import { CommentList } from "../comments/CommentsList";
import { selectThreadByID, Thread } from "./threadSlice";
import { ThreadExcerpt } from "./ThreadExcerpt";

export function ThreadPage() {
  const { id } = useParams();
  const ID: Number = Number(id)
  const thread: Thread = useAppSelector(selectThreadByID(ID));
  return (
    <article className="thread">
      <ThreadExcerpt thread={thread} />
      <CommentList key={ID.toString()} ID={ID.toString()} />
    </article>
  );
}
