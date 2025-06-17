import { use } from "react";
import GroupClient from "./GroupClient"; // 👈 относительный путь!

export default function Page({
  params,
}: {
  params: Promise<{ groupKey: string }>;
}) {
  const { groupKey } = use(params);
  return <GroupClient groupKey={groupKey} />;
}
