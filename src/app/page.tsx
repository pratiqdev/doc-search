"use client";

import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Search, Searchable } from '@/components/Search';


const links:Searchable[] = [

  {
    type: 'link',
    href: 'https://placekitten.com',
    title: 'Placekitten - placeholder images',
    content: 'Brighten up the development process with some cute kittens',
    tags: ['cool', 'image', 'placeholder', 'design', 'api'],
  },
]

const pages:Searchable[] = [
  {
    type: 'page',
    href: '/about',
    title: 'About Me',
    content: 'Event based state management API for typescript and React.',
    tags: ['nodejs', 'javascript', 'proxy'],
  },
  
   {
    type: 'page',
    href: '/meta',
    title: 'About This App',
    content: 'Learn more about how this app works under the hood',
    tags: ['nextjs', 'shadcn', 'shadcn/ui', 'tailwind', 'vercel', 'internal'],
  },
]

const projects:Searchable[] = [
   {
    type: 'project',
    href: '/projects/nestore',
    title: 'Nestore',
    content: 'Event based state management API for typescript and React.',
    tags: ['nodejs', 'javascript', 'proxy'],
  },
  {
    type: 'project',
    href: '/projects/hooks',
    title: '@pratiq/hooks',
    content: 'Collection of custom hooks, utilities and high-order components for React',
    tags: ['React', 'CSR', 'Nextjs', 'SSG', 'SSR', 'ISR'],
  },
  {
    type: 'project',
    href: '/projects/mde',
    title: 'MDE Markdown Editor',
    content: 'VSCode inspired in-browser editor with shortcuts, snippets and command palette',
    tags: ['Browser', 'local storage', '', 'Material UI', 'CSR', 'React'],
  },
  {
    type: 'project',
    href: '/projects/gitwell',
    title: 'gitwell',
    content: 'command line tool for frequent gitters.',
    tags: ['python', 'cli'],
  },

]

const blogs:Searchable[] = [
    {
    type: 'blog',
    href: '/blog/good-image-component',
    title: 'Creating a decent Image component',
    content: 'Using vanilla React after using Next.js for many years - I feel the plain html <img> or <picture> components to be severely lacking',
    tags: ['image', 'react', 'data-url', 'lazy-loading', 'blur effect'],
  },
   {
    type: 'blog',
    href: '/blog/quick-kv',
    title: 'A Simple KV config API',
    content: 'When developing, deploying and maintaining apps and sites, its common to require some config flags to toggle some features or behavior of the app',
    tags: ['api', 'config', 'flags', 'vercel', 'next-kv', 'storage', 'db', 'in-memory-store'],
  },
]

const socials:Searchable[] = [
  {
    type: 'linkedin',
    href: 'https://linkedin.com/in/michael-jannetta',
    title: 'LinkedIn',
    content: '/pratiqdev - LinkedIn professional developer profile, portfolio and resume',
    tags: ['social', 'contact', 'developer', 'job posting', 'career', 'Michael Jannetta'],
  },
  {
    type: 'github',
    href: 'https://github.com/pratiqdev',
    title: 'GitHub',
    content: '/pratiqdev - Check out some of my public work on GitHub',
    tags: ['social', 'contact', 'developer', 'experiments', 'research', 'Michael Jannetta'],
  },
  {
    type: 'wyzant',
    href: 'https://wyzant.com/tutors/pratiqdev',
    title: 'Wyzant',
    content: '/pratiqdev - Need help with a bootcamp or assignment? Reach out for web design, development and deployment tutoring',
    tags: ['social', 'contact', 'developer', 'tutor', 'education', 'teach', 'Michael Jannetta'],
  },
  {
    type: 'instagram',
    href: 'https://instagram.com/pratiqdev',
    title: 'Instagram',
    content: '/pratiqdev - Instagram social profile.',
    tags: ['social', 'contact', 'developer', 'Michael Jannetta'],
  },
  {
    type: 'twitter',
    href: 'https://twitter.com/pratiqdev',
    title: 'Twitter',
    content: '/pratiqdev - Twitter social profile.',
    tags: ['social', 'contact', 'developer', 'Michael Jannetta'],
  },
] 

const images:Searchable[] = [
  {
    type: 'image',
    href: '/images/bento-design',
    title: 'Bento design',
    content: 'Design concepts using liminal space between clearly defined boundaries.',
    tags: ['design', 'bento', 'figma'],
  },
    {
    type: 'image',
    href: '/images/figma-prototype',
    title: 'Figma app prototype',
    content: 'Check out how I use figma to design and prototype an application or website',
    tags: ['design', 'figma', 'wireframe', 'sketch', 'previs', 'development', 'styling', 'content-creation'],
  },
]

const searchable:Searchable[] = [
  ...links,
  ...pages,
  ...projects,
  ...blogs,
  ...socials,
  ...images
]


export default function Home() {
  return (
    <main>
      <h1>shadcn/ui demo</h1>

    <Button>Default</Button>


    <div className="m-6 p-2 bg-slate-100 shadow-lg rounded-md">
      <Search searchable={searchable}/>

    </div>



    </main>
  )
}
