import { getDictationQuestions } from "./actions";
import DictationClient from "./DictationClient";

export default async function DictationPage() {
  const questions = await getDictationQuestions(10);
  return <DictationClient questions={questions} />;
}
