import type { MetaFunction } from "@remix-run/node";

export const meta: MetaFunction = () => {
  return [
    { title: "New Remix SPA" },
    { name: "description", content: "Welcome to Remix (SPA Mode)!" },
  ];
};

export default function Index() {
  return (
    <div className="grid min-h-[750px] grid-cols-9 grid-rows-6 gap-4 p-10">
      <div className="col-span-2 border"></div>
      <div className="col-span-2 border"></div>
      <div className="col-span-2 border"></div>
      <div className="col-span-3 row-span-9 border"></div>
      <div className="col-span-6 row-span-8 border"></div>
    </div>
  );
}
