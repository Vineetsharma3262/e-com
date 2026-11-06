import { notFound } from "next/navigation";
import { CollectionView } from "@/components/CollectionView";
import { collectionStats, collections, getCollection, productsIn } from "@/lib/catalog";

export function generateStaticParams() {
  return [...collections.map((collection) => ({ slug: collection.slug })), { slug: "all" }];
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const collection = getCollection(slug);
  if (!collection) return {};
  return { title: collection.title };
}

export default async function CollectionPage({ params }) {
  const { slug } = await params;
  const collection = getCollection(slug);
  if (!collection) notFound();
  const list = productsIn(slug);
  const stats = collectionStats(slug);
  return <CollectionView collection={collection} products={list} count={stats.count} from={stats.from} />;
}
