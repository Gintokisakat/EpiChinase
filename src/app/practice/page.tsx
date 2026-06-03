import { getPracticeQuestions } from "./actions";
import PracticeMenu from "./PracticeMenu";
import PracticeClient from "./PracticeClient";

export default async function PracticePage() {
  const questions = await getPracticeQuestions(12);
  return <PracticeMenu questions={questions} />;
}
