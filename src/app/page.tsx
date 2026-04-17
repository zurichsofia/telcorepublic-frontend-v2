import { permanentRedirect } from "next/navigation";

import { services } from "@/data/services";

export default function Home() {
  permanentRedirect(`/services/${services[0].slug}`);
}
