import { getTurboQuestions } from "./actions";
import TurboClient from "./TurboClient";

export default async function TurboPage() {
  const questions = await getTurboQuestions(20);
  return <TurboClient initialQuestions={questions} />;
}
