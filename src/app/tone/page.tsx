import { getToneQuestions } from "./actions";
import ToneClient from "./ToneClient";

export default async function TonePage() {
  const questions = await getToneQuestions(10);
  return <ToneClient questions={questions} />;
}
