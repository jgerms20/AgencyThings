import SiteHeader from "@/components/SiteHeader";
import SpaceFilters from "@/components/SpaceFilters";
import { spaces } from "@/lib/spaces";

export default function SpacesPage() {
  return (
    <main className="spaces-page directory-refresh directory-refresh--spaces">
      <SiteHeader active="spaces" />
      <section className="page-opening spaces-opening">
        <h1>Where they actually spend time.</h1>
        <p>Friendships move between shared games, group chats, school, and the places they meet in person.</p>
      </section>
      <SpaceFilters spaces={spaces} />
    </main>
  );
}
