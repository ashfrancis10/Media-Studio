import { createFileRoute } from "@tanstack/react-router";
import { HomeView } from "@/components/home-view";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Media Studio · North Devon" },
      {
        name: "description",
        content:
          "Business content studio in North Devon. Content creation, social media, strategy, storytelling and creative direction.",
      },
    ],
  }),
  component: HomeView,
});
