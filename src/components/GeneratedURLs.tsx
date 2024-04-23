import { Flex, Box, Heading, ScrollArea, Separator, Card, } from '@radix-ui/themes'
import React from 'react'
import UrlCard from './UrlCard'
import { type url } from '~/types/url'

interface GeneratedURLsProps {
    links: url[]
    handleDelete: (id: number) => void
}

function GeneratedURLs({
    links = [],
    handleDelete
}: GeneratedURLsProps) {
    return (
        <Card className='w-full bg-white' variant='classic' asChild>
            <ScrollArea scrollbars="vertical" className='w-full max-h-96 px-4 py-6'>
                <Box className='w-full'>
                    <Heading size="4" mb="2" trim="start">
                        Generated URLs
                    </Heading>
                    <Separator my="3" size="4" />
                    <Flex direction="column" gap="2">
                        {
                            links.map((link) => (
                                <UrlCard key={link.id} link={link} handleDelete={handleDelete} />
                            ))
                        }
                    </Flex>
                </Box>
            </ScrollArea>
        </Card>
    )
}

export default GeneratedURLs