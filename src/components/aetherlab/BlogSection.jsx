import React from 'react';
import BlogCard from './BlogCard';
import SectionTitle from './SectionTitle';

export default function BlogSection({
  title = 'Latest Blog Posts',
  subtitle = 'From Our Blog',
  description = '',
  posts = [],
  columns = 3,
  onReadMore
}) {
  return (
    <section
      style={{
        backgroundColor: '#ffffff',
        padding: '110px 0'
      }}
    >
      <div
        style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '0 20px'
        }}
      >
        {/* Section Title */}
        {(title || subtitle) && (
          <div style={{ marginBottom: '50px' }}>
            <SectionTitle
              subtitle={subtitle}
              title={title}
              description={description}
            />
          </div>
        )}

        {/* Blog Grid */}
        {posts.length > 0 ? (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: `repeat(auto-fit, minmax(${100 / columns}%, 1fr))`,
              gap: '30px'
            }}
          >
            {posts.map((post, index) => (
              <BlogCard
                key={index}
                image={post.image}
                title={post.title}
                excerpt={post.excerpt}
                author={post.author}
                date={post.date}
                category={post.category}
                link={post.link}
                onReadMore={() => onReadMore && onReadMore(post)}
              />
            ))}
          </div>
        ) : (
          <div
            style={{
              textAlign: 'center',
              padding: '60px 20px',
              color: '#888'
            }}
          >
            <p>No blog posts available.</p>
          </div>
        )}
      </div>
    </section>
  );
}