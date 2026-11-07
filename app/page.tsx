import NavigationRail from "@/components/NavigationRail";
import BlocksSidebar from "@/components/BlocksSidebar";
import EditorCanvas from "@/components/EditorCanvas";
import DesignSidebar from "@/components/DesignSidebar";

export default function Home() {
  return (
    <>
      <NavigationRail />
      <BlocksSidebar />
      <EditorCanvas />
      <DesignSidebar />
    </>
  );
}
