import { NextRequest, NextResponse } from "next/server"

type Link = {
    longUrl: string
}

export const getServerSideProps = (async ({ req, res }: {
    req: NextRequest,
    res: NextResponse
}) => {
    const longUrl = "https://www.google.com"
    // redirect to long url

    return {
        redirect: {
            destination: false ? longUrl : "/",
            permanent: false,
        },
    }
})

function Page({ links }: { links: Link[] }) {
    return (
        <div>{JSON.stringify(links)}</div>
    )
}

export default Page