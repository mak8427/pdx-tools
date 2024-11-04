import Eu4Ui from "@/features/eu4/Eu4Ui";
import { MetaFunction } from "@remix-run/cloudflare";
import { useParams } from "@remix-run/react";
import { useMemo } from "react";

export const meta: MetaFunction = ({ params: { saveId } }) => {
  return [
    { name: "twitter:image", content: `/eu4/saves/${saveId}/og.webp` },
    { name: "twitter:card", content: "summary_large_image" },
    { name: "og:image", content: `/eu4/saves/${saveId}/og.webp` },
  ];
}
export default function SaveRoute() {
  const { saveId } = useParams();
  return <SavePage saveId={saveId!} />;
}

type SaveProps = {
  saveId: string;
};

const SavePage = ({ saveId }: SaveProps) => {
  const save = useMemo(() => ({ kind: "server", saveId }) as const, [saveId]);
  return <Eu4Ui save={save} />;
};
