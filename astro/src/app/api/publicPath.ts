export function getAssetBase(): string {
  if (typeof document === "undefined") return "/";
  return document.documentElement.dataset.assetBase ?? "/";
}

export function createConcertHref(assetBase: string, projectId: string, concertId: string): string {
  const base = assetBase.endsWith("/") ? assetBase : `${assetBase}/`;
  return `${base}projects/${encodeURIComponent(projectId)}/concerts/${encodeURIComponent(concertId)}/`;
}
