export function safeNext(value, fallback = "/account") {
  if (typeof value !== "string" || !value.startsWith("/") || value.startsWith("//") || value.includes("\\")) {
    return fallback;
  }
  return value;
}

export function withNext(path, next) {
  const target = safeNext(next, "");
  if (!target) return path;
  return `${path}${path.includes("?") ? "&" : "?"}next=${encodeURIComponent(target)}`;
}
