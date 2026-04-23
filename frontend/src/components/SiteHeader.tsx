import Link from "next/link";
import LogoIcon from "@/components/LogoIcon";
import BrandWordmark from "@/components/BrandWordmark";

export default function SiteHeader() {
  const brand = (
    <div className="flex items-center gap-3">
      <LogoIcon />
      <BrandWordmark
        className="text-xs"
        style={{ fontFamily: "var(--font-press-start)", color: "#e6edf3" }}
      />
    </div>
  );

  return (
    <header
      className="flex items-center justify-between px-6 py-4"
      style={{ borderBottom: "1px solid #30363d" }}
    >

        <Link href="/" className="flex items-center gap-3" style={{ textDecoration: "none" }}>
          {brand}
        </Link>

        <span
          className="text-xs"
          style={{ fontFamily: "var(--font-mono)", color: "#484f58" }}
        >
          v1.0
        </span>
    </header>
  );
}
