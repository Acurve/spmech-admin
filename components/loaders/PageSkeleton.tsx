import React from 'react'

const PageSkeleton = () => {
    return (
        <div className='space-y-4'>
            {/* header */}
            <div className='h-16 bg-gray-200 animate-pulse rounded-2xl' />

            {/* main content */}
            <div className='h-[calc(100dvh-64px-16px-16px-16px)] grid grid-cols-1 grid-rows-4 md:grid-rows-12 md:grid-cols-6 gap-4'>
                <div className='bg-gray-200 row-span-1 md:row-span-9 md:col-span-2 animate-pulse rounded-2xl' />
                <div className='bg-gray-200 row-span-1 md:row-span-8 md:col-span-4 animate-pulse rounded-2xl' />
                <div className='bg-gray-200 row-span-1 md:row-span-3 md:col-span-2 md:row-start-10 animate-pulse rounded-2xl' />
                <div className='bg-gray-200 row-span-1 md:row-span-4 md:col-span-4 animate-pulse rounded-4xl md:rounded-2xl' />
            </div>
        </div>
    )
}

export default PageSkeleton