import React, { useState } from 'react';
import { Search } from 'lucide-react';

export default function BlogSidebar({
  widgets = {}
}) {
  const [searchQuery, setSearchQuery] = useState('');

  const {
    showSearch = true,
    onSearch,
    popularPosts = [],
    categories = [],
    tags = []
  } = widgets;

  const handleSearch = () => {
    if (onSearch) {
      onSearch(searchQuery);
    }
  };

  return (
    <aside style={{ marginTop: '30px' }}>
      {/* Search Widget */}
      {showSearch && (
        <div
          style={{
            marginBottom: '40px',
            overflow: 'hidden',
            padding: '40px',
            borderRadius: '8px',
            backgroundColor: '#ffffff',
            boxShadow: '0px 0px 20px rgba(0, 0, 0, 0.11)',
            borderTop: '3px solid #7E57FF'
          }}
        >
          <h3
            style={{
              fontSize: '18px',
              marginBottom: '25px',
              position: 'relative',
              fontWeight: 600,
              lineHeight: '28px',
              zIndex: 1,
              color: '#081828',
              margin: 0,
              marginBottom: '25px'
            }}
          >
            Search Posts
          </h3>
          <form style={{ position: 'relative', display: 'flex' }}>
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: '100%',
                backgroundColor: '#ffffff',
                height: '55px',
                border: 'none',
                padding: '0 55px 0 25px',
                fontSize: '15px',
                fontWeight: 400,
                borderRadius: '6px',
                backgroundColor: '#ffffff',
                border: '1px solid #eee',
                boxShadow: '0px 0px 23px transparent',
                transition: 'all 0.4s ease'
              }}
              onFocus={(e) => {
                e.target.style.boxShadow = '0px 0px 23px rgba(0, 0, 0, 0.06)';
                e.target.style.borderColor = '#7E57FF';
              }}
              onBlur={(e) => {
                e.target.style.boxShadow = '0px 0px 23px transparent';
                e.target.style.borderColor = '#eee';
              }}
            />
            <button
              type="button"
              onClick={handleSearch}
              style={{
                border: 'none',
                position: 'absolute',
                right: 0,
                top: 0,
                width: '55px',
                height: '55px',
                zIndex: 1,
                fontSize: '18px',
                transition: 'all 0.3s ease-out',
                borderRadius: '0',
                padding: 0,
                backgroundColor: 'transparent',
                color: '#333',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = '#7E57FF')}
              onMouseLeave={(e) => (e.currentTarget.style.color = '#333')}
            >
              <Search size={18} />
            </button>
          </form>
        </div>
      )}

      {/* Popular Posts Widget */}
      {popularPosts.length > 0 && (
        <div
          style={{
            marginBottom: '40px',
            overflow: 'hidden',
            padding: '40px',
            borderRadius: '8px',
            backgroundColor: '#ffffff',
            boxShadow: '0px 0px 20px rgba(0, 0, 0, 0.11)',
            borderTop: '3px solid #7E57FF'
          }}
        >
          <h3
            style={{
              fontSize: '18px',
              marginBottom: '25px',
              position: 'relative',
              fontWeight: 600,
              lineHeight: '28px',
              zIndex: 1,
              color: '#081828',
              margin: 0,
              marginBottom: '25px'
            }}
          >
            Popular Posts
          </h3>
          {popularPosts.map((post, index) => (
            <div
              key={index}
              style={{
                display: 'flex',
                marginBottom: '25px',
                paddingBottom: '25px',
                alignItems: 'center',
                borderBottom: '1px solid rgba(238, 238, 238, 0.68)'
              }}
            >
              <div style={{ position: 'relative', flex: 1 }}>
                <h4 style={{ marginBottom: '12px', lineHeight: '26px', margin: 0 }}>
                  <a
                    href={post.link}
                    style={{
                      fontSize: '15px',
                      fontWeight: 600,
                      color: '#081828',
                      textDecoration: 'none',
                      transition: 'color 0.3s ease'
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = '#7E57FF')}
                    onMouseLeave={(e) => (e.currentTarget.style.color = '#081828')}
                  >
                    {post.title}
                  </a>
                </h4>
                {post.date && (
                  <p
                    style={{
                      fontWeight: 400,
                      fontSize: '14px',
                      color: '#727272',
                      margin: 0
                    }}
                  >
                    {post.date}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Categories Widget */}
      {categories.length > 0 && (
        <div
          style={{
            marginBottom: '40px',
            overflow: 'hidden',
            padding: '40px',
            borderRadius: '8px',
            backgroundColor: '#ffffff',
            boxShadow: '0px 0px 20px rgba(0, 0, 0, 0.11)',
            borderTop: '3px solid #7E57FF'
          }}
        >
          <h3
            style={{
              fontSize: '18px',
              marginBottom: '25px',
              position: 'relative',
              fontWeight: 600,
              lineHeight: '28px',
              zIndex: 1,
              color: '#081828',
              margin: 0,
              marginBottom: '25px'
            }}
          >
            Categories
          </h3>
          <ul style={{ margin: 0, padding: 0 }}>
            {categories.map((category, index) => (
              <li key={index} style={{ listStyle: 'none' }}>
                <a
                  href={category.link}
                  style={{
                    fontSize: '15px',
                    padding: '8px 0',
                    fontWeight: 500,
                    display: 'block',
                    color: '#081828',
                    textDecoration: 'none',
                    transition: 'all 0.3s ease',
                    borderBottom: index < categories.length - 1 ? '1px solid #eee' : 'none'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = '#7E57FF';
                    e.currentTarget.style.paddingLeft = '10px';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = '#081828';
                    e.currentTarget.style.paddingLeft = '0';
                  }}
                >
                  {category.name}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Tags Widget */}
      {tags.length > 0 && (
        <div
          style={{
            marginBottom: '40px',
            overflow: 'hidden',
            padding: '40px',
            borderRadius: '8px',
            backgroundColor: '#ffffff',
            boxShadow: '0px 0px 20px rgba(0, 0, 0, 0.11)',
            borderTop: '3px solid #7E57FF'
          }}
        >
          <h3
            style={{
              fontSize: '18px',
              marginBottom: '25px',
              position: 'relative',
              fontWeight: 600,
              lineHeight: '28px',
              zIndex: 1,
              color: '#081828',
              margin: 0,
              marginBottom: '25px'
            }}
          >
            Popular Tags
          </h3>
          <div style={{ display: 'flex', gap: '5px', flexWrap: 'wrap' }}>
            {tags.map((tag, index) => (
              <a
                key={index}
                href={tag.link}
                style={{
                  display: 'inline-flex',
                  justifyContent: 'center',
                  padding: '8px 20px',
                  textTransform: 'capitalize',
                  fontSize: '14px',
                  fontWeight: 500,
                  marginBottom: '10px',
                  color: '#081828',
                  border: '1px solid #eee',
                  backgroundColor: 'transparent',
                  borderRadius: '30px',
                  textDecoration: 'none',
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#7E57FF';
                  e.currentTarget.style.color = '#ffffff';
                  e.currentTarget.style.borderColor = 'transparent';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                  e.currentTarget.style.color = '#081828';
                  e.currentTarget.style.borderColor = '#eee';
                }}
              >
                {tag.name}
              </a>
            ))}
          </div>
        </div>
      )}
    </aside>
  );
}