import { createElement } from "react";

const LessionComponentHtml = ({ value, htmlTag,...probs }) => {
  return createElement(htmlTag??"div", probs, value)
  return <div className={className}>{value}</div>;
};

export default LessionComponentHtml;