"use client";

import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Searchable } from '@/lib/types';
import { Search } from '@/components/Search';
import searchableItems from '@/lib/searchable';



export default function Home() {
  return (
    <main>
      <h1>shadcn/ui demo</h1>

    <Button>Default</Button>


    <div className="m-6 p-2 bg-slate-100 shadow-lg rounded-md">
      <Search searchable={searchableItems}/>

    </div>



    </main>
  )
}
