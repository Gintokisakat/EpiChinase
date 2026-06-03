import { getTreeData } from "./actions";
import TreeClient from "./TreeClient";

export default async function TreePage() {
  const levels = await getTreeData();
  return <TreeClient levels={levels} />;
}
