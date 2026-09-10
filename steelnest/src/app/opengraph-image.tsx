import { ImageResponse } from "next/og";

/**
 * 社交分享预览图（1200x630 PNG）。
 * 之前用的是 200x200 的 SVG，Facebook / X / LinkedIn / WhatsApp 都不渲染 SVG，
 * 分享出去是一条没有图的链接。这里按各平台通用尺寸生成位图。
 */

export const alt = "LabOrigin — Lab-Grown Diamonds Direct From the Source";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          backgroundColor: "#1A1A1A",
          padding: "72px 80px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <div
            style={{
              width: 56,
              height: 2,
              backgroundColor: "#C5A059",
            }}
          />
          <div
            style={{
              fontSize: 24,
              letterSpacing: 2,
              color: "#C5A059",
              textTransform: "uppercase",
            }}
          >
            Direct from Henan, China
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          <div style={{ fontSize: 78, color: "#FFFFFF", lineHeight: 1.1 }}>
            Lab-grown diamonds,
          </div>
          <div style={{ fontSize: 78, color: "#C5A059", lineHeight: 1.1 }}>
            from the source.
          </div>
          <div style={{ fontSize: 28, color: "#9A9A9A", marginTop: 8 }}>
            Sourcing · Quality auditing · White-label manufacturing
          </div>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            borderTop: "1px solid rgba(255,255,255,0.15)",
            paddingTop: 28,
          }}
        >
          <div style={{ fontSize: 34, color: "#FFFFFF" }}>LabOrigin</div>
          <div style={{ fontSize: 24, color: "#9A9A9A" }}>
            steelneststore.com
          </div>
        </div>
      </div>
    ),
    size
  );
}
