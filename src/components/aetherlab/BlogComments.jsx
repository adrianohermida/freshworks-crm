import React from 'react';

export default function BlogComments({
  comments = []
}) {
  const renderComments = (commentList, isNested = false) => {
    return (
      <ul
        style={{
          margin: 0,
          padding: 0,
          listStyle: 'none',
          marginLeft: isNested ? '130px' : '0'
        }}
      >
        {commentList.map((comment, index) => (
          <li
            key={index}
            style={{
              paddingLeft: isNested ? '0' : '110px',
              position: 'relative',
              fontSize: '15px',
              borderRadius: '8px',
              marginTop: isNested ? '35px' : '50px'
            }}
          >
            {/* Comment Avatar */}
            {comment.avatar && (
              <div
                style={{
                  position: isNested ? 'relative' : 'absolute',
                  top: 0,
                  left: 0,
                  width: '80px',
                  height: '80px',
                  marginBottom: isNested ? '18px' : '0'
                }}
              >
                <img
                  src={comment.avatar}
                  alt={comment.author}
                  style={{
                    maxWidth: '80px',
                    maxHeight: '80px',
                    borderRadius: '50%',
                    display: 'block'
                  }}
                />
              </div>
            )}

            {/* Comment Content */}
            <div style={{ marginTop: isNested ? '0' : '0' }}>
              {/* Comment Header */}
              <div style={{ marginBottom: '20px', position: 'relative', display: 'block' }}>
                <h6
                  style={{
                    fontSize: '16px',
                    marginBottom: '8px',
                    fontWeight: 600,
                    color: '#081828',
                    margin: 0,
                    marginBottom: '8px'
                  }}
                >
                  {comment.author}
                </h6>
                <span
                  style={{
                    fontSize: '14px',
                    fontWeight: 400,
                    color: '#888',
                    display: 'inline-block'
                  }}
                >
                  {comment.date}
                </span>

                {/* Reply Link */}
                {comment.onReply && (
                  <a
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      comment.onReply();
                    }}
                    style={{
                      position: 'absolute',
                      right: 0,
                      top: 0,
                      display: 'inline-block',
                      fontSize: '14px',
                      fontWeight: 500,
                      zIndex: 2,
                      color: '#081828',
                      textDecoration: 'none',
                      transition: 'color 0.3s ease'
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = '#7E57FF')}
                    onMouseLeave={(e) => (e.currentTarget.style.color = '#081828')}
                  >
                    Reply
                  </a>
                )}
              </div>

              {/* Comment Text */}
              <p
                style={{
                  fontWeight: 400,
                  marginBottom: 0,
                  fontSize: '15px',
                  color: '#727272',
                  lineHeight: '26px',
                  margin: '20px 0 0 0'
                }}
              >
                {comment.content}
              </p>

              {/* Nested Replies */}
              {comment.replies && comment.replies.length > 0 && (
                renderComments(comment.replies, true)
              )}
            </div>
          </li>
        ))}
      </ul>
    );
  };

  return (
    <div
      style={{
        marginTop: '80px'
      }}
    >
      <h3
        style={{
          fontSize: '20px',
          fontWeight: 700,
          marginBottom: '30px',
          position: 'relative',
          zIndex: 1,
          textTransform: 'capitalize',
          color: '#081828',
          margin: 0,
          marginBottom: '30px'
        }}
      >
        Comments ({comments.length})
      </h3>

      {comments.length > 0 ? (
        <div style={{ position: 'relative' }}>
          {renderComments(comments)}
        </div>
      ) : (
        <p style={{ color: '#888', fontSize: '15px' }}>No comments yet.</p>
      )}
    </div>
  );
}