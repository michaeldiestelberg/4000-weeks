const Logo = ({ size = 'md' }) => {
  const sizes = {
    sm: { width: 32, dotSize: 1.5 },
    md: { width: 48, dotSize: 2.2 },
    lg: { width: 64, dotSize: 3 },
    xl: { width: 80, dotSize: 3.8 }
  };

  const { width, dotSize } = sizes[size];
  const radius = width / 16;

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 64 64"
      width={width}
      height={width}
      className="inline-block"
    >
      <rect width="64" height="64" rx={radius} fill="#3B82F6"/>

      {/* Grid of dots representing weeks - faded */}
      <g fill="#FFFFFF" opacity="0.4">
        {Array.from({ length: 6 }, (_, row) =>
          Array.from({ length: 6 }, (_, col) => (
            <circle
              key={`bg-${row}-${col}`}
              cx={12 + col * 8}
              cy={12 + row * 8}
              r={dotSize}
            />
          ))
        )}
      </g>

      {/* Highlighted dots (past weeks) */}
      <g fill="#FFFFFF">
        <circle cx="12" cy="12" r={dotSize}/>
        <circle cx="20" cy="12" r={dotSize}/>
        <circle cx="28" cy="12" r={dotSize}/>
        <circle cx="36" cy="12" r={dotSize}/>
        <circle cx="12" cy="20" r={dotSize}/>
        <circle cx="20" cy="20" r={dotSize}/>
      </g>

      {/* Current week (yellow dot) */}
      <circle cx="28" cy="20" r={dotSize} fill="#FCD34D"/>
    </svg>
  );
};

export default Logo;
