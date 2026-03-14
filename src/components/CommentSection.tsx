import React, { useEffect, useState } from 'react';
import { db } from '../firebase';
import { 
  collection, 
  addDoc, 
  query, 
  where, 
  orderBy, 
  onSnapshot, 
  serverTimestamp 
} from "firebase/firestore";
import './CommentSection.css';

interface Comment {
  id: string;
  gameId: string;
  nickname: string;
  text: string;
  createdAt: any;
}

interface CommentSectionProps {
  gameId: string;
  currentNickname: string;
}

const CommentSection: React.FC<CommentSectionProps> = ({ gameId, currentNickname }) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const q = query(
      collection(db, "comments"),
      where("gameId", "==", gameId),
      orderBy("createdAt", "desc")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetchedComments = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Comment[];
      setComments(fetchedComments);
    });

    return () => unsubscribe();
  }, [gameId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() || isSubmitting) return;

    setIsSubmitting(true);
    try {
      await addDoc(collection(db, "comments"), {
        gameId,
        nickname: currentNickname,
        text: newComment.trim(),
        createdAt: serverTimestamp()
      });
      setNewComment('');
    } catch (error) {
      console.error("Error adding comment: ", error);
      alert("Failed to post comment. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="comment-section">
      <h3>Community <span>Comments</span> ({comments.length})</h3>
      
      <form onSubmit={handleSubmit} className="comment-form">
        <textarea
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Share your thoughts about this game..."
          maxLength={300}
        />
        <div className="form-footer">
          <span>Posting as: <strong>{currentNickname}</strong></span>
          <button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Posting...' : 'Post Comment'}
          </button>
        </div>
      </form>

      <div className="comments-list">
        {comments.length > 0 ? (
          comments.map((comment) => (
            <div key={comment.id} className="comment-item">
              <div className="comment-header">
                <span className="comment-author">{comment.nickname}</span>
                <span className="comment-date">
                  {comment.createdAt?.toDate ? comment.createdAt.toDate().toLocaleDateString() : 'Just now'}
                </span>
              </div>
              <p className="comment-text">{comment.text}</p>
            </div>
          ))
        ) : (
          <p className="no-comments">No comments yet. Be the first to share your thoughts!</p>
        )}
      </div>
    </div>
  );
};

export default CommentSection;
