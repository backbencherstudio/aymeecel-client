import Image from 'next/image';
import React from 'react';

interface CustomImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  style?: React.CSSProperties;  // Add style prop
}

const CustomImage: React.FC<CustomImageProps> = ({
  src,
  alt,
  width = 500,
  height = 500,
  className,
  style,  // Add style to props
}) => {
  return (
    <Image
      src={src}
      alt={alt}
      width={width}
      height={height}
      className={className}
      style={style}  // Pass style to Image component
    />
  );
};

export default CustomImage;