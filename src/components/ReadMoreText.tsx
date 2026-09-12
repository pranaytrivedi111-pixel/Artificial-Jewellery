import React, { useState, useRef, useLayoutEffect, useCallback, useId } from 'react';

export interface ReadMoreTextProps {
  children: React.ReactNode;
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'p' | 'div' | 'span';
  maxLines?: number;
  className?: string;
  containerClassName?: string;
  buttonClassName?: string;
  expandLabel?: string;
  collapseLabel?: string;
  quoteMarks?: boolean;
  prefix?: React.ReactNode;
  id?: string;
}

// Helper to extract plain text string from React nodes
const extractString = (node: React.ReactNode): string => {
  if (node == null) return '';
  if (typeof node === 'string' || typeof node === 'number') {
    return String(node);
  }
  if (Array.isArray(node)) {
    return node.map(extractString).join('');
  }
  if (React.isValidElement(node) && node.props) {
    const props = node.props as { children?: React.ReactNode };
    if (props.children) {
      return extractString(props.children);
    }
  }
  return '';
};

export const ReadMoreText: React.FC<ReadMoreTextProps> = ({
  children,
  as: Component = 'div',
  maxLines = 2,
  className = '',
  containerClassName = '',
  buttonClassName = '',
  expandLabel = 'Read more',
  collapseLabel = 'Read less',
  quoteMarks = false,
  prefix,
  id,
}) => {
  const generatedId = useId();
  const elementId = id || `readmore-${generatedId.replace(/:/g, '')}`;

  const [isExpanded, setIsExpanded] = useState(false);
  const [hasOverflow, setHasOverflow] = useState(false);
  const [truncatedText, setTruncatedText] = useState<string>('');

  const containerRef = useRef<HTMLDivElement | null>(null);
  const measureRef = useRef<HTMLDivElement | null>(null);

  const fullText = extractString(children).trim();
  const prefixText = prefix ? extractString(prefix).trim() + ' ' : '';

  // Measure whether text exceeds maxLines and calculate exact inline truncation
  const checkOverflow = useCallback(() => {
    const el = measureRef.current;
    const container = containerRef.current;
    if (!el || !container || !fullText) return;

    // Reset styles on measureRef to test two-line height
    el.style.display = '-webkit-box';
    el.style.webkitLineClamp = String(maxLines);
    el.style.webkitBoxOrient = 'vertical';
    el.style.overflow = 'hidden';
    el.style.maxHeight = 'none';
    el.textContent = (prefixText ? prefixText : '') + (quoteMarks ? `"${fullText}"` : fullText);

    const twoLineHeight = el.clientHeight;
    const scrollH = el.scrollHeight;

    // If it comfortably fits within maxLines, no truncation needed
    if (scrollH <= twoLineHeight + 2) {
      setHasOverflow(false);
      setTruncatedText(fullText);
      return;
    }

    setHasOverflow(true);

    // Switch to unconstrained height capped at twoLineHeight to binary search slice
    el.style.display = 'block';
    el.style.webkitLineClamp = 'unset';
    el.style.webkitBoxOrient = 'unset';
    el.style.maxHeight = `${twoLineHeight + 1}px`;
    el.style.overflow = 'hidden';

    let low = 0;
    let high = fullText.length;
    let best = 0;

    const suffix = '... ' + expandLabel + (quoteMarks ? '"' : '');

    while (low <= high) {
      const mid = Math.floor((low + high) / 2);
      const candidate = fullText.slice(0, mid);
      el.textContent = (prefixText ? prefixText : '') + (quoteMarks ? `"${candidate}` : candidate) + suffix;

      if (el.scrollHeight <= twoLineHeight + 2) {
        best = mid;
        low = mid + 1; // can fit more text
      } else {
        high = mid - 1; // exceeded 2 lines, retreat
      }
    }

    // Trim to last clean space boundary so words aren't cut mid-word
    let clean = fullText.slice(0, best);
    const lastSpace = clean.lastIndexOf(' ');
    if (lastSpace > best * 0.7) {
      clean = clean.slice(0, lastSpace);
    }
    // Remove trailing punctuation before ellipsis
    clean = clean.replace(/[,.;:!?\s]+$/, '');

    setTruncatedText(clean || fullText.slice(0, best));
  }, [fullText, prefixText, maxLines, quoteMarks, expandLabel]);

  useLayoutEffect(() => {
    checkOverflow();

    if (typeof document !== 'undefined' && 'fonts' in document) {
      document.fonts.ready.then(checkOverflow).catch(() => {});
    }

    const container = containerRef.current;
    if (!container) return;

    let resizeObserver: ResizeObserver | null = null;
    if (typeof ResizeObserver !== 'undefined') {
      resizeObserver = new ResizeObserver(() => {
        checkOverflow();
      });
      resizeObserver.observe(container);
    }

    const handleWindowResize = () => {
      checkOverflow();
    };

    window.addEventListener('resize', handleWindowResize);

    return () => {
      if (resizeObserver) resizeObserver.disconnect();
      window.removeEventListener('resize', handleWindowResize);
    };
  }, [checkOverflow]);

  const handleToggle = useCallback((e?: React.MouseEvent) => {
    if (e) {
      e.stopPropagation();
      e.preventDefault();
    }
    setIsExpanded((prev) => !prev);
  }, []);

  // Text to display
  const displayedBodyText = isExpanded || !hasOverflow ? fullText : truncatedText || fullText;

  return (
    <div ref={containerRef} id={elementId} className={`relative ${containerClassName}`}>
      {/* Visible Component with merged inline link */}
      <Component className={className}>
        {prefix}
        {quoteMarks && '"'}
        <span>{displayedBodyText}</span>
        {!isExpanded && hasOverflow && '...'}
        {quoteMarks && '"'}
        {hasOverflow && (
          <button
            type="button"
            onClick={handleToggle}
            className={`inline font-bold cursor-pointer select-none transition-colors hover:underline ml-1.5 ${
              buttonClassName || 'text-[#B3874B] hover:text-amber-900'
            }`}
            aria-expanded={isExpanded}
          >
            {isExpanded ? collapseLabel : expandLabel}
          </button>
        )}
      </Component>

      {/* Hidden constant measurement clone */}
      <div
        ref={measureRef}
        aria-hidden="true"
        className={`absolute inset-x-0 top-0 pointer-events-none opacity-0 invisible select-none ${className}`}
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          top: 0,
          visibility: 'hidden',
          pointerEvents: 'none',
          zIndex: -999,
        }}
      />
    </div>
  );
};
