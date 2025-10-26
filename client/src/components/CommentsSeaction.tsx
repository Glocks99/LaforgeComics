import { useEffect, useState } from "react";
import axios from "axios";

interface Comment {
  _id: string;
  user: {
    firstName: string;
    lastName: string;
   };
  text: string;
  createdAt: string;
}

export const getColorFromName = (name: string) => {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  const hue = hash % 360;
  return `hsl(${hue},70%, 60%)`;
};

const CommentsSection = ({ comicId, msg }: { comicId: string; msg: string }) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(false);
  const [timeNow, setTimeNow] = useState(new Date());

   

  useEffect(() => {
    const interval = setInterval(() => setTimeNow(new Date()), 60000);
    return () => clearInterval(interval);
  }, []);

  const timeAgo = (dateString: string) => {
    const now = timeNow;
    const posted = new Date(dateString);
    const diff = (now.getTime() - posted.getTime()) / 1000; // seconds

    if (diff < 60) return "just now";
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    if (diff < 2592000) return `${Math.floor(diff / 86400)}d ago`;
    return posted.toLocaleDateString();
  };

  useEffect(() => {
  let isMounted = true;
  const fetchComments = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(`${import.meta.env.VITE_BackendURL}/api/comments/comic/${comicId}`);
      if (isMounted && data.success) setComments(data.comments);
    } catch (err) {
      console.error(err);
    } finally {
      if (isMounted) setLoading(false);
    }
  };
  if (comicId) fetchComments();
  return () => { isMounted = false; };
}, [comicId, msg]);


  return (
    <div className="flex-1 space-y-4 pb-8">

      {loading ? (
        <p className="text-gray-400 text-sm text-center">Loading comments...</p>
      ) : comments.length === 0 ? (
        <p className="text-gray-400 text-sm text-center">
          No comments yet on this comic.
        </p>
      ) : (
        <>
          {comments.map((comment) => (
            <div
              key={comment._id}
              className="flex items-start gap-3 p-1 transition"
            >
                <div
                  className="h-8 w-8 flex items-center justify-center rounded-full text-white font-semibold"
                  style={{ backgroundColor: getColorFromName(comment.user.firstName + comment.user.lastName) }}
                >
                  {comment.user.firstName[0].toUpperCase()}
                  {comment.user.lastName[0].toUpperCase()}
                </div>

          
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <p className="text-white font-medium text-sm">
                    {comment.user?.firstName || "Anonymous"}
                  </p>
                  <span className="text-xs text-gray-400">
                    {timeAgo(comment.createdAt)}
                  </span>
                </div>
                <p className="text-gray-300 text-sm mt-1 line-clamp-3">{comment.text}</p>
              </div>
            </div>
          ))}
        </>
      )}
    </div>
  );
};

export default CommentsSection;
