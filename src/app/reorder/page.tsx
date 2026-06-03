import { getReorderQuestions } from "./actions";
import ReorderClient from "./ReorderClient";

export default async function ReorderPage() {
  const questions = await getReorderQuestions(10);
  return <ReorderClient questions={questions} />;
}
