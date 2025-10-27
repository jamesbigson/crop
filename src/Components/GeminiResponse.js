import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

const GeminiResponse = ({ text }) => {
  return (
    <div className="markdown-body">
      <ReactMarkdown remarkPlugins={[remarkGfm]}>
        {text}
      </ReactMarkdown>
    </div>
  );
};

export default GeminiResponse;
