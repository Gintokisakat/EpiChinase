import { getSpeechCards } from "./actions";
import SpeechClient from "./SpeechClient";

export default async function SpeechPage() {
  const cards = await getSpeechCards(10);
  return <SpeechClient cards={cards} />;
}
