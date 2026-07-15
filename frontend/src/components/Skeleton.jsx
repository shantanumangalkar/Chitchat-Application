/**
 * Reusable premium Skeleton loader component with theme support.
 */
const Skeleton = ({ 
  className = '', 
  variant = 'text', // text, circle, rect
  width, 
  height 
}) => {
  const variantClasses = {
    text: 'h-4 w-full rounded-md',
    circle: 'rounded-full shrink-0',
    rect: 'rounded-xl',
  };

  const style = {
    backgroundColor: 'var(--skeleton-bg)',
  };
  if (width) style.width = width;
  if (height) style.height = height;

  return (
    <div
      style={style}
      className={`
        animate-pulse
        ${variantClasses[variant]}
        ${className}
      `}
    />
  );
};

export default Skeleton;
