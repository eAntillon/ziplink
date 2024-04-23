import { Icon } from '@iconify/react/dist/iconify.js'
import { Card, Code, DataList, DropdownMenu, Flex, IconButton } from '@radix-ui/themes'
import React from 'react'
import toast from 'react-hot-toast'
import { useCopyToClipboard } from 'usehooks-ts'
import { env } from '~/env'
import { type radixUiColor } from '~/types/color'
import { type url } from '~/types/url'

interface UrlCardProps {
    color?: radixUiColor
    link: url
    handleDelete: (id: number) => void
}

function UrlCard({
    color = 'gray',
    link,
    handleDelete
}: UrlCardProps) {

    const [_, copy] = useCopyToClipboard()

    const copyToClipboard = (text: string) => {
        copy(text).then(() => {
            toast.success(
                () => (
                    <div className="flex flex-col gap-2 justify-center">
                        <span className="text-sm font-semibold">Link copied to clipboard!</span>
                        <Code
                            size="2"
                            color={color}
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


    return (
        <Card>
            <DropdownMenu.Root>
                <DropdownMenu.Trigger className='absolute right-2 top-2 font-sans'>
                    <IconButton variant="soft" size="1" color='gray'>
                        <Icon icon="bx:dots-vertical-rounded" />
                    </IconButton>
                </DropdownMenu.Trigger>
                <DropdownMenu.Content className='font-mono'>
                    <DropdownMenu.Item color="red" onClick={() => handleDelete(link.id)}>
                        <Icon icon="bx:trash" />
                        Delete
                    </DropdownMenu.Item>
                </DropdownMenu.Content>
            </DropdownMenu.Root>
            <DataList.Root>
                <DataList.Item>
                    <DataList.Label minWidth="88px">Long url</DataList.Label>
                    <DataList.Value>{link.url}</DataList.Value>
                </DataList.Item>
                <DataList.Item>
                    <DataList.Label minWidth="88px">Short Link</DataList.Label>
                    <DataList.Value>
                        <Flex align="center" gap="2">
                            <Code variant="ghost">{env.NEXT_PUBLIC_URL_PREFIX + link.shortUrl}</Code>
                            <IconButton
                                size="1"
                                aria-label="Copy value"
                                color="gray"
                                variant="ghost"
                                onClick={() => copyToClipboard(env.NEXT_PUBLIC_URL_PREFIX + link.shortUrl)}
                            >
                                <Icon icon="bx:copy" />
                            </IconButton>
                        </Flex>
                    </DataList.Value>
                </DataList.Item>
            </DataList.Root>
        </Card>

    )
}

export default UrlCard