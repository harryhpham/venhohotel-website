import { rooms } from "@/lib/data/rooms";
import RoomDetailClient from "@/components/sections/RoomDetailClient";

export function generateStaticParams() {
  return rooms.map((r) => ({ slug: r.slug }));
}

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const room = rooms.find((r) => r.slug === params.slug);
  if (!room) return {};
  return { title: `${room.nameVi} | Ven Ho Hotel`, description: room.description };
}

export default function RoomDetailPage({ params }: { params: { slug: string } }) {
  return <RoomDetailClient slug={params.slug} />;
}
