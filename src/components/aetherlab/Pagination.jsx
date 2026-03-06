import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function Pagination({
  currentPage = 1,
  totalPages = 5,
  onPageChange,
  alignment = 'center',
  className = '',
}) {
  const alignmentStyles = {
    left: 'text-align: left',
    center: 'text-align: center',
    right: 'text-align: right',
  };

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages && onPageChange) {
      onPageChange(page);
    }
  };

  const getPageNumbers = () => {
    const pages = [];
    
    // Always show first page
    pages.push(1);
    
    // Show ellipsis and middle pages if needed
    if (currentPage > 3) {
      pages.push('...');
    }
    
    // Show pages around current page
    const start = Math.max(2, currentPage - 1);
    const end = Math.min(totalPages - 1, currentPage + 1);
    
    for (let i = start; i <= end; i++) {
      if (!pages.includes(i)) {
        pages.push(i);
      }
    }
    
    // Show ellipsis and last page if needed
    if (currentPage < totalPages - 2) {
      pages.push('...');
    }
    
    if (totalPages > 1) {
      pages.push(totalPages);
    }
    
    return pages;
  };

  const pageNumbers = getPageNumbers();

  return (
    <div
      style={{
        textAlign: alignment,
        margin: 'var(--spacing-2xl) 0 0 0',
        display: 'block',
      }}
      className={className}
    >
      <ol
        style={{
          display: 'inline-block',
          overflow: 'hidden',
          listStyle: 'none',
          margin: 0,
          padding: 0,
        }}
      >
        {/* Previous Button */}
        <li
          style={{
            marginRight: 'var(--spacing-xs)',
            display: 'inline-block',
            marginTop: 'var(--spacing-md)',
          }}
        >
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            style={{
              backgroundColor: currentPage === 1 ? '#f0f0f0' : '#fff',
              color: currentPage === 1 ? '#999' : 'var(--color-heading)',
              fontWeight: 'var(--font-weight-semibold)',
              fontSize: 'var(--font-size-sm)',
              borderRadius: 'var(--border-radius-sm)',
              padding: 'var(--spacing-sm) var(--spacing-lg)',
              textAlign: 'center',
              border: '1px solid #eee',
              cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
              transition: 'all var(--transition-base)',
              display: 'inline-flex',
              alignItems: 'center',
              gap: 'var(--spacing-sm)',
            }}
            onMouseEnter={(e) => {
              if (currentPage !== 1) {
                e.currentTarget.style.backgroundColor = 'var(--color-primary)';
                e.currentTarget.style.color = 'var(--color-white)';
                e.currentTarget.style.borderColor = 'transparent';
              }
            }}
            onMouseLeave={(e) => {
              if (currentPage !== 1) {
                e.currentTarget.style.backgroundColor = '#fff';
                e.currentTarget.style.color = 'var(--color-heading)';
                e.currentTarget.style.borderColor = '#eee';
              }
            }}
          >
            <ChevronLeft size={16} />
          </button>
        </li>

        {/* Page Numbers */}
        {pageNumbers.map((page, index) => (
          <li
            key={index}
            style={{
              marginRight: 'var(--spacing-xs)',
              display: 'inline-block',
              marginTop: 'var(--spacing-md)',
            }}
          >
            {page === '...' ? (
              <span
                style={{
                  padding: 'var(--spacing-sm) var(--spacing-lg)',
                  textAlign: 'center',
                  display: 'inline-block',
                }}
              >
                {page}
              </span>
            ) : (
              <button
                onClick={() => handlePageChange(page)}
                style={{
                  backgroundColor: currentPage === page ? 'var(--color-primary)' : '#fff',
                  color: currentPage === page ? 'var(--color-white)' : 'var(--color-heading)',
                  fontWeight: 'var(--font-weight-semibold)',
                  fontSize: 'var(--font-size-sm)',
                  borderRadius: 'var(--border-radius-sm)',
                  padding: 'var(--spacing-sm) var(--spacing-lg)',
                  textAlign: 'center',
                  border: currentPage === page ? 'none' : '1px solid #eee',
                  cursor: 'pointer',
                  transition: 'all var(--transition-base)',
                  minWidth: '40px',
                }}
                onMouseEnter={(e) => {
                  if (currentPage !== page) {
                    e.currentTarget.style.backgroundColor = 'var(--color-primary)';
                    e.currentTarget.style.color = 'var(--color-white)';
                    e.currentTarget.style.borderColor = 'transparent';
                  }
                }}
                onMouseLeave={(e) => {
                  if (currentPage !== page) {
                    e.currentTarget.style.backgroundColor = '#fff';
                    e.currentTarget.style.color = 'var(--color-heading)';
                    e.currentTarget.style.borderColor = '#eee';
                  }
                }}
              >
                {page}
              </button>
            )}
          </li>
        ))}

        {/* Next Button */}
        <li
          style={{
            marginRight: 0,
            display: 'inline-block',
            marginTop: 'var(--spacing-md)',
          }}
        >
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            style={{
              backgroundColor: currentPage === totalPages ? '#f0f0f0' : '#fff',
              color: currentPage === totalPages ? '#999' : 'var(--color-heading)',
              fontWeight: 'var(--font-weight-semibold)',
              fontSize: 'var(--font-size-sm)',
              borderRadius: 'var(--border-radius-sm)',
              padding: 'var(--spacing-sm) var(--spacing-lg)',
              textAlign: 'center',
              border: '1px solid #eee',
              cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
              transition: 'all var(--transition-base)',
              display: 'inline-flex',
              alignItems: 'center',
              gap: 'var(--spacing-sm)',
            }}
            onMouseEnter={(e) => {
              if (currentPage !== totalPages) {
                e.currentTarget.style.backgroundColor = 'var(--color-primary)';
                e.currentTarget.style.color = 'var(--color-white)';
                e.currentTarget.style.borderColor = 'transparent';
              }
            }}
            onMouseLeave={(e) => {
              if (currentPage !== totalPages) {
                e.currentTarget.style.backgroundColor = '#fff';
                e.currentTarget.style.color = 'var(--color-heading)';
                e.currentTarget.style.borderColor = '#eee';
              }
            }}
          >
            <ChevronRight size={16} />
          </button>
        </li>
      </ol>
    </div>
  );
}