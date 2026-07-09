import { notFound } from "next/navigation";
import { rooms } from "@/lib/data/rooms";
import RoomDetailClient from "@/components/sections/RoomDetailClient";
import JsonLd from "@/components/seo/JsonLd";

export function generateStaticParams() {
  return rooms.map((r) => ({ slug: r.slug }));
}

type RoomRouteProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: RoomRouteProps) {
  const { slug } = await params;
  const room = rooms.find((r) => r.slug === slug);
  if (!room) return {};
  return {
    title: room.nameVi,
    description: `${room.nameVi} tại Ven Hồ Hotel — ${room.size}m², ${room.beds}. ${room.description}`,
    openGraph: {
      title: room.nameVi,
      description: room.description,
      images: [
        {
          url: room.images[0],
          alt: `${room.nameVi} — Ven Hồ Hotel Hà Nội`,
        },
      ],
    },
  };
}

export default async function RoomDetailPage({ params }: RoomRouteProps) {
  const { slug } = await params;
  const room = rooms.find((r) => r.slug === slug);
  if (!room) notFound();

  const base = "https://venhohotel.com";

  const roomSchema = {
    "@context": "https://schema.org",
    "@type": "HotelRoom",
    name: room.nameVi,
    description: room.description,
    url: `${base}/phong/${room.slug}`,
    image: room.images.map((img) => `${base}${img}`),
    bed: room.beds,
    floorSize: {
      "@type": "QuantitativeValue",
      value: room.size,
      unitCode: "MTK",
    },
    ...(room.priceVnd
      ? {
          offers: {
            "@type": "Offer",
            price: room.priceVnd,
            priceCurrency: "VND",
            availability: "https://schema.org/InStock",
          },
        }
      : {}),
    amenityFeature: room.amenities.map((a) => ({
      "@type": "LocationFeatureSpecification",
      name: a,
      value: true,
    })),
    containedInPlace: {
      "@type": "Hotel",
      "@id": `${base}/#hotel`,
    },
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Ven Hồ Hotel", item: base },
      { "@type": "ListItem", position: 2, name: "Phòng Nghỉ", item: `${base}/phong` },
      { "@type": "ListItem", position: 3, name: room.nameVi, item: `${base}/phong/${room.slug}` },
    ],
  };

  return (
    <>
      <JsonLd data={roomSchema} />
      <JsonLd data={breadcrumbSchema} />
      <RoomDetailClient slug={slug} />
    </>
  );
}
