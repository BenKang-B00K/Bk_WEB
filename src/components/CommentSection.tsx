import React, { useEffect, useState, useRef, useCallback } from 'react';
import { db } from '../firebase';
import {
  collection,
  addDoc,
  query,
  where,
  orderBy,
  getDocs,
  startAfter,
  limit,
  serverTimestamp,
  QueryDocumentSnapshot,
  type DocumentData,
} from "firebase/firestore";
import './CommentSection.css';

const PAGE_SIZE = 20;

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
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(false);
  const lastDocRef = useRef<QueryDocumentSnapshot<DocumentData> | null>(null);

  const fetchComments = useCallback(async (reset: boolean) => {
    const q = reset || !lastDocRef.current
      ? query(
          collection(db, "comments"),
          where("gameId", "==", gameId),
          orderBy("createdAt", "desc"),
          limit(PAGE_SIZE)
        )
      : query(
          collection(db, "comments"),
          where("gameId", "==", gameId),
          orderBy("createdAt", "desc"),
          startAfter(lastDocRef.current),
          limit(PAGE_SIZE)
        );

    const snapshot = await getDocs(q);
    const fetched = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Comment[];

    if (snapshot.docs.length > 0) {
      lastDocRef.current = snapshot.docs[snapshot.docs.length - 1];
    }
    setHasMore(snapshot.docs.length === PAGE_SIZE);

    if (reset) {
      setComments(fetched);
    } else {
      setComments(prev => [...prev, ...fetched]);
    }
  }, [gameId]);

  useEffect(() => {
    lastDocRef.current = null;
    setComments([]);
    setHasMore(false);
    fetchComments(true);
  }, [fetchComments]);

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
      // Re-fetch from the top so the new comment appears immediately
      lastDocRef.current = null;
      await fetchComments(true);
    } catch (error) {
      console.error("Error adding comment: ", error);
      setSubmitError("Failed to post comment. Please try again.");
      setTimeout(() => setSubmitError(null), 4000);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLoadMore = async () => {
    setIsLoadingMore(true);
    await fetchComments(false);
    setIsLoadingMore(false);
  };

  const countLabel = `${comments.length}${hasMore ? '+' : ''}`;

  return (
    <div className="comment-section">
      <h3>Community <span>Comments</span> ({countLabel})</h3>

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
        {submitError && <p className="comment-submit-error">{submitError}</p>}
      </form>

      <div className="comments-list">
        {comments.length > 0 ? (
          <>
            {comments.map((comment) => (
              <div key={comment.id} className="comment-item">
                <div className="comment-header">
                  <span className="comment-author">{comment.nickname}</span>
                  <span className="comment-date">
                    {comment.createdAt?.toDate ? comment.createdAt.toDate().toLocaleDateString() : 'Just now'}
                  </span>
                </div>
                <p className="comment-text">{comment.text}</p>
              </div>
            ))}
            {hasMore && (
              <button
                className="load-more-btn"
                onClick={handleLoadMore}
                disabled={isLoadingMore}
              >
                {isLoadingMore ? 'Loading...' : 'Load More Comments'}
              </button>
            )}
          </>
        ) : (
          <p className="no-comments">No comments yet. Be the first to share your thoughts!</p>
        )}
      </div>
    </div>
  );
};

export default CommentSection;
