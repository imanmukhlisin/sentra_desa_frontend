import { getHomeContent } from "@/application/use-cases/get-public-content";
import { FlutterHome } from "@/presentation/features/flutter-home";

export default async function HomePage() {
  const content = await getHomeContent();

  return <FlutterHome products={content.products} highlights={content.highlights} />;
}
