import type { Metadata } from "next";
import { Suspense } from "react";
import { RequestScheduleView } from "@/components/request-schedule-view";
import { privateMetadata } from "@/lib/seo";

const runtimeToken = "__runtime__";

export const metadata: Metadata = {
  ...privateMetadata,
  title: "Supply & delivery schedule update",
  referrer: "no-referrer",
};

export function generateStaticParams() {
  return [{ token: runtimeToken }];
}

export default function RequestUpdatePage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  return (
    <div className="shell page-content journey-content">
      <Suspense
        fallback={
          <div className="loading-text">Opening your request update…</div>
        }
      >
        <RequestUpdateDetails params={params} />
      </Suspense>
    </div>
  );
}

async function RequestUpdateDetails({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  return <RequestScheduleView token={(await params).token} />;
}
