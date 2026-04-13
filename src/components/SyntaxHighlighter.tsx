import { Prism as Highlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import { useMemo } from "react";

interface Props {
  code: string;
  type?: string;
}

const SyntaxHighlighter = ({ code, type }: Props) => {

  const language = useMemo(() => {
    switch (type) {
      case "xsd":
        return "markup";
      case "hierarchy":
        return "bash";
      case "predictor":
        return "json";
      case "report":
        return "markdown";
      case "table":
        return "sql";
      case "validation":
        return "bash";
      case "confidence":
        return "json";
      default:
        return "markup";
    }
  }, [type]);

  return (
    <Highlighter
      language={language}
      style={oneDark}
      showLineNumbers
      wrapLongLines
      customStyle={{
        borderRadius: "14px",
        padding: "18px",
        fontSize: "13px",
        height: "100%",
        backgroundColor: "#0f172a",
      }}
    >
      {code || "// Output will appear here..."}
    </Highlighter>
  );
};

export default SyntaxHighlighter;