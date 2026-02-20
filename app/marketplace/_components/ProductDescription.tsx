import React from "react";
import DOMPurify from "dompurify";

const ProductDescription: React.FC<{ description: string }> = ({
  description,
}) => {
  const sanitizedDescription = DOMPurify.sanitize(description);
  return (
    <div className="prose max-w-none">
      <div dangerouslySetInnerHTML={{ __html: sanitizedDescription }} />
    </div>
  );
};

export default ProductDescription;
