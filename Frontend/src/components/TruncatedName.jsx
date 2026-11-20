import { CTooltip } from "@coreui/react";
import "./TruncatedName.css";

export default function TruncatedName({ text, className = "" }) {
  if (text === null || text === undefined || text === "") return "-";

  const value = String(text);

  return (
    <span className={["truncated-name", className].filter(Boolean).join(" ")}>
      <CTooltip content={value} placement="top">
        <span className="truncated-name__text">{value}</span>
      </CTooltip>
    </span>
  );
}
