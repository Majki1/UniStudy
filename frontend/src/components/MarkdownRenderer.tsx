import React from "react";
import ReactMarkdown from "react-markdown";

interface MarkdownRendererProps {
  children: string;
  className?: string;
}

const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({
  children,
  className,
}) => {
  return (
    <ReactMarkdown
      className={className}
      components={{
        strong: ({ node, ...props }) => (
          <span className="font-bold text-primary-text-color" {...props} />
        ),
        em: ({ node, ...props }) => <span className="italic" {...props} />,
        code: ({ inline, ...props }: any) =>
          inline ? (
            <code
              className="bg-primary/30 px-1 py-0.5 rounded font-mono text-gradient-start"
              {...props}
            />
          ) : (
            <code {...props} />
          ),
        pre: ({ node, ...props }) => (
          <pre
            className="bg-primary/50 p-3 my-2 rounded-md overflow-x-auto font-mono text-gradient-start text-sm"
            {...props}
          />
        ),
        h2: ({ node, ...props }) => (
          <h2
            className="text-xl font-bold text-primary-text-color mt-4 mb-2"
            {...props}
          />
        ),
        h3: ({ node, ...props }) => (
          <h3
            className="text-lg font-bold text-primary-text-color mt-3 mb-2"
            {...props}
          />
        ),
        ul: ({ node, ...props }) => (
          <ul className="list-disc pl-5 my-2" {...props} />
        ),
        ol: ({ node, ...props }) => (
          <ol className="list-decimal pl-5 my-2" {...props} />
        ),
      }}
    >
      {children}
    </ReactMarkdown>
  );
};

export default MarkdownRenderer;
