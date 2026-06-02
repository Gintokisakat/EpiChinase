import { getNewCards } from "../dashboard/actions";
import LearnClient from "./LearnClient";

export default async function LearnPage() {
  const cards = await getNewCards(5);
  return <LearnClient initialCards={cards} />;
}
