import { getPopWords } from "./actions";
import PopClient from "./PopClient";

export default async function PopPage() {
  const words = await getPopWords(40);
  return <PopClient initialWords={words} />;
}
