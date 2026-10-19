import type { NextConfig } from "next";

const dev = process.env.NODE_ENV !== "production";

/**
 * Content Security Policy. Next.js streams inline scripts for hydration, so
 * scripts allow 'unsafe-inline' but only from this origin otherwise; eval is
 * allowed in development only (React Refresh). KaTeX and the figures need inline
 * styles; WebGL needs nothing extra. Framing is forbidden outright.
 */
const csp = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline'${dev ? " 'unsafe-eval'" : ""}`,
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob:",
  "font-src 'self' data:",
  `connect-src 'self'${dev ? " ws: wss:" : ""}`,
  "worker-src 'self' blob:",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
  ...(dev ? [] : ["upgrade-insecure-requests"]),
].join("; ");

const securityHeaders = [
  { key: "Content-Security-Policy", value: csp },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), payment=(), usb=(), interest-cohort=()" },
  { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
  ...(dev ? [] : [{ key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains" }]),
];

const nextConfig: NextConfig = {
  // A stray package-lock.json in the home directory would otherwise be picked as the workspace root.
  turbopack: { root: __dirname },
  // Local QA runs on 127.0.0.1 too (a separate cookie jar from localhost). Dev server only.
  allowedDevOrigins: ["127.0.0.1"],
  poweredByHeader: false,
  async headers() {
    return [
      { source: "/:path*", headers: securityHeaders },
      // Personal and class data must never be cached by a shared proxy.
      { source: "/api/export/:path*", headers: [{ key: "Cache-Control", value: "no-store" }] },
    ];
  },
};

export default nextConfig;
