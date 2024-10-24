export function seo({
  title,
  description,
}: {
  title?: string;
  description?: string;
}): React.JSX.IntrinsicElements["meta"][] {
  const titles = title ? [{ title }, { name: "og:title", content: title }] : [];

  const descriptions = description
    ? [
        { name: "description", content: description },
        { name: "og:description", content: description },
        { name: "twitter:description", content: description },
      ]
    : [];

  return [...titles, ...descriptions];
}
