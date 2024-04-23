import {
  Button,
  Callout,
  Card,
  Code,
  Flex,
  Heading,
  IconButton,
  TextField,
  Tooltip,
} from "@radix-ui/themes";
import { api } from "~/utils/api";
import { createCaller } from "~/server/api/root";
import { createTRPCContext } from "~/server/api/trpc";
import { Icon } from "@iconify/react";
import { signIn, signOut, useSession } from "next-auth/react";
import { type NextApiRequest, type NextApiResponse } from "next";
import { type url } from "~/types/url";
import { useForm, type SubmitHandler } from "react-hook-form";
import { useMemo } from "react";
import getRandomRadixColor from "~/utils/color";
import Head from "next/head";
import toast from "react-hot-toast";
import { useCopyToClipboard, useLocalStorage } from 'usehooks-ts'
import dynamic from "next/dynamic";
import { env } from "~/env";
import Link from "next/link";
import Image from "next/image";
import t3logo from "../../public/t3-light.png";
const GeneratedURLs = dynamic(() => import('~/components/GeneratedURLs'), { ssr: false })


const URL_PATTERN =
  /^https?:\/\/(?:www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b(?:[-a-zA-Z0-9()@:%_\+.~#?&\/=]*)$/;
interface IFormInput {
  url: string;
}

interface IProps {
  userGeneratedLinks: url[];
}

export const getServerSideProps = async ({
  req,
  res,
}: {
  req: NextApiRequest;
  res: NextApiResponse;
}) => {
  const ctx = await createTRPCContext({
    req,
    res,
    info: {
      isBatchCall: false,
      calls: [],
    },
  });
  const caller = createCaller(ctx);
  try {
    const links = await caller.urls.getLinksByUser();
    console.log(links.toString());
    return {
      props: {
        userGeneratedLinks: (JSON.parse(JSON.stringify(links)) as url[]) ?? [],
      },
    };
  } catch (error) {
    console.error("Error fetching user links");
    return {
      props: {
        userGeneratedLinks: [],
      },
    };
  }
};

export default function Home({ userGeneratedLinks }: IProps) {


  // const [links, setLinks] = useState<url[]>(userGeneratedLinks ?? []);
  const [userLinks, setUserLinks, removeUserLinks] = useLocalStorage("links", userGeneratedLinks ?? []);

  const [copiedText, copy] = useCopyToClipboard()

  const copyToClipboard = (text: string) => {
    copy(text).then(() => {
      toast.success(
        () => (
          <div className="flex flex-col gap-2 justify-center">
            <span className="text-sm font-semibold">Link copied to clipboard!</span>
            <Code
              size="2"
              color={uiColor}
              className="flex w-full justify-center"
            >
              {text}
            </Code>
          </div>
        ),
        {
          duration: 5000,
          icon: "🚀",
          position: "top-right",
          style: {
            border: "1px solid #0588f0",
            padding: "10px",
            color: "#530026e9",
          },
        },
      );
    }).catch((error) => {
      console.error("Error copying to clipboard", error)
    })

  };
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<IFormInput>({
    defaultValues: {
      url: "",
    },
    reValidateMode: "onChange",
  });
  const uiColor = useMemo(() => getRandomRadixColor(), []);
  const createLinkMutation = api.urls.create.useMutation();
  const deleteLinkMutation = api.urls.deleteLink.useMutation();
  const { data: session } = useSession();
  const onSubmit: SubmitHandler<IFormInput> = async (data) => {
    createLinkMutation.mutate(
      {
        longUrl: data.url,
      },
      {
        onSuccess: (data) => {
          setUserLinks([...userLinks, data[0] ?? ({} as url)]);
          copyToClipboard(`${env.NEXT_PUBLIC_URL_PREFIX}${data[0]?.shortUrl}`);
          reset();
        },
        onError: (error) => {
          if (error.data?.httpStatus === 403) {
            toast.error("Too many requests. Please try again later.",
              {
                duration: 5000,
                icon: "🚫",
                position: "top-right",
                style: {
                  border: "1px solid #0588f0",
                  padding: "10px",
                  color: "#530026e9",
                },
              },
            );
          }
        },
      },
    );
  };
  const handleDelete = async (linkId: number) => {

    if (!session?.user) {
      setUserLinks(userLinks.filter((l) => l.id !== linkId));
      toast.success(() => (
        <div className="flex flex-col gap-2 justify-center">
          <span className="text-sm font-semibold">Link deleted successfully</span>
        </div>
      ), {
        duration: 5000,
        icon: "🗑️",
        position: "top-right",
        style: {
          border: "1px solid #0588f0",
          padding: "10px",
          color: "#530026e9",
        },

      });
      return;
    }

    try {
      deleteLinkMutation.mutate(
        {
          userId: session?.user?.id ?? null,
          urlId: linkId,
        },
        {
          onSuccess: () => {
            setUserLinks(userLinks.filter((l) => l.id !== linkId));
            toast.success("Link deleted successfully", {
              duration: 5000,
              icon: "🗑️",
              position: "top-right",
              style: {
                border: "1px solid #0588f0",
                padding: "10px",
                color: "#530026e9",
              },

            });
          },
          onError: () => {
            toast.error("An error occurred while deleting the link");
          },
        },
      );
    } catch (error) {
      toast.error("An error occurred while deleting the link");
    }
  };
  return (
    <>
      <Head>
        <title>Ziplink - URL Shorten</title>
        <meta name="description" content="Generated by create-t3-app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="mx-auto flex min-h-screen w-full max-w-screen-sm flex-col items-center justify-center gap-4 ">
        <Card
          className="flex w-full flex-col items-center justify-center gap-3 bg-white"
          variant="classic"
        >
          <Flex
            className="w-full"
            align="center"
            justify="end"
            direction="row"
            gap="2"
          >
            {/* <IconButton color={uiColor} variant="solid">
              <Icon icon="bx:sun" />
            </IconButton>
            <IconButton color={uiColor} variant="solid">
              <Icon icon="bx:moon" />
            </IconButton> */}
            {
              session?.user ? (
                <Tooltip content="Log out" className="font-mono">
                  <IconButton
                    color={uiColor}
                    variant="solid"
                    onClick={() => signOut()}
                  >
                    <Icon icon="bx:log-out" />
                  </IconButton>
                </Tooltip>
              ) : (
                <Tooltip content="Log in" className="font-mono">

                  <IconButton
                    color={uiColor}
                    variant="solid"
                    onClick={() => signIn()}
                  >
                    <Icon icon="bx:user" />
                  </IconButton>
                </Tooltip>
              )
            }
            <IconButton
              color="gray"
              variant="outline"
              onClick={() => signIn()}
            >
              <Icon icon="bx:cog" />
            </IconButton>

          </Flex>
          <Heading className="w-full">
            <Code
              size="9"
              color={uiColor}
              variant="soft"
              className="flex w-full justify-center"
            >
              🔗ziplink
            </Code>
          </Heading>
          <div className="mt-1 flex flex-col md:flex-row w-full gap-2">
            <TextField.Root
              placeholder="Paste the url you want to shrink..."
              size="3"
              className="w-full"
              color={uiColor}
              variant="surface"
              {...register("url", {
                required: true,
                min: 4,
                pattern: URL_PATTERN,
              })}
            >
              <TextField.Slot color={uiColor}>
                <Icon icon="bx:world" />
              </TextField.Slot>
            </TextField.Root>
            <Button
              color={uiColor}
              size="3"
              variant="solid"
              onClick={handleSubmit(onSubmit)}
              loading={createLinkMutation.isPending}
            >
              <Icon icon="bx:link-alt" />
              Shorten
            </Button>
          </div>
          <p className="text-sm font-semibold italic text-[#E93D82]">
            {errors.url?.type === "pattern" && "Please enter a valid URL"}
            {errors.url?.type === "min" && "URL must be at least 4 characters"}
          </p>
        </Card>
        {
          userLinks.length > 0 && (
            <GeneratedURLs links={userLinks} handleDelete={handleDelete} />
          )
        }
        {/* <Callout.Root color={uiColor}  variant="outline" size="1" className="bg-white/80">
          <Callout.Icon>
            <Icon icon="bx:info-circle" />
          </Callout.Icon>
          <Callout.Text className="text-gray-500 italic">
            You are not logged in. Your links will be deleted after 24 hours.
          </Callout.Text>
        </Callout.Root> */}

        <Flex direction="row" className="absolute left-4 bottom-3" gap="2">
          <IconButton
            color={uiColor}
            variant="outline"
            asChild
          >
            <Link href="https://github.com/eAntillon/ziplink" target="_blank">
              <Icon icon="mdi:github" className="text-white"/>
            </Link>
          </IconButton>
          <IconButton
            color={uiColor}
            variant="outline"
            asChild
            className="p-2"
          >
            <Link href="https://create.t3.gg/" target="_blank">
              <Image src={t3logo as unknown as string} alt="t3-stack-logo" />
            </Link>
          </IconButton>
        </Flex>

      </main>
    </>
  );
}
