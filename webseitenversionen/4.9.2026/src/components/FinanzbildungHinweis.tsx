import type { CSSProperties } from "react";

interface FinanzbildungHinweisProps {
  style?: CSSProperties;
  className?: string;
}

export default function FinanzbildungHinweis({ style, className }: FinanzbildungHinweisProps) {
  return (
    <div
      className={className}
      style={{
        padding: "16px 20px",
        background: "rgba(201, 168, 76, 0.07)",
        border: "1px solid rgba(201, 168, 76, 0.22)",
        borderRadius: 8,
        fontSize: 13,
        color: "#cdc6be",
        lineHeight: 1.7,
        marginTop: 32,
        marginBottom: 32,
        ...style,
      }}
    >
      <strong style={{ color: "#e2c27d" }}>Rechtlicher Hinweis:</strong> Die bereitgestellten Inhalte dienen ausschließlich der allgemeinen Finanzbildung gemäß § 2 Abs. 8 Nr. 10 WpHG. Sie stellen keine individuelle Anlageberatung, keine Steuerberatung und keine Rechtsberatung dar.
    </div>
  );
}
