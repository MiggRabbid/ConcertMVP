export function getAssetBase(): string {
  if (typeof document === "undefined") return "/";
  return document.documentElement.dataset.assetBase ?? "/";
}
