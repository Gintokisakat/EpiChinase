import { getShopData } from "../actions/shop";
import ShopClient from "./ShopClient";

export default async function ShopPage() {
  const data = await getShopData();
  return <ShopClient {...data} />;
}
