import { getDueCards } from "../dashboard/actions";
import ReviewClient from "./ReviewClient";

export default async function ReviewPage() {
  const cards = await getDueCards(20);
  return <ReviewClient initialCards={cards} />;
}
