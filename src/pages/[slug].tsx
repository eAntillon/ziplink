import { TRPCError } from "@trpc/server";
import { getHTTPStatusCodeFromError } from "@trpc/server/unstable-core-do-not-import";
import { type NextApiRequest, type NextApiResponse } from "next";
import { createCaller } from "~/server/api/root";
import { createTRPCContext } from "~/server/api/trpc";

export const getServerSideProps = async ({req, res}: {
  req: NextApiRequest,
  res: NextApiResponse
}) => {
  const ctx = await createTRPCContext({
    req, res,
    info: {
      isBatchCall: false,
      calls: []
    }
  });
  const caller = createCaller(ctx);
  console.log("REQUESTING URL", req.url)
  try {
    const url = await caller.urls.getLink({ id: req.url?.slice(1) ?? "" as string });
    console.log("FIND LONG URL", url)
    if (url) {
      return {
        redirect: {
          destination: url.url ?? '/404',
          permanent: false,
        },
      }
    }
  } catch (cause) {
    console.log("ERROR", cause)
    if (cause instanceof TRPCError) {
      // An error from tRPC occurred
      const httpCode = getHTTPStatusCodeFromError(cause);
      return res.status(httpCode).json(cause);
    }
    res.status(500).json({ message: "Internal server error" });
  }

}

function Page() {
  return null
}

export default Page