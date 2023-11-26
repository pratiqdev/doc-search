import { Searchable } from '@/lib/types';
import { FuseOptionKey } from 'fuse.js';

const links:Searchable[] = [

  {
    type: 'link',
    href: 'https://placekitten.com',
    title: 'Placekitten - placeholder images',
    content: 'Brighten up the development process with some cute kittens',
    tags: ['cool', 'image', 'placeholder', 'design', 'api'],
  },
  {
   type: 'link',
   href: 'https://nettuts.com',
   title: 'NETTUTS',
   content: 'NETTUTS is a blog/tutorial site that provides detailed tutorials on a wide range of web development topics. It is perfect for developers at all levels.',
   tags: ['tutorial', 'web development', 'step by step'],
 },
 {
   type: 'link',
   href: 'https://woork.it',
   title: 'Woork',
   content: 'Woork is a blog by Antonio Lupetti, a developer from Italy. It provides short, easily-consumable tutorials on various topics of web development such as PHP, Cold Fusion, JavaScript, and CSS.',
   tags: ['tutorial', 'web development', 'php', 'cold fusion', 'javascript', 'css'],
 },
 {
   type: 'link',
   href: 'https://smashingmagazine.com',
   title: 'Smashing Magazine',
   content: 'Smashing Magazine is an excellent resource for web designers and developers looking to be inspired. It publishes almost every day, despite their very detailed and thorough posts.',
   tags: ['inspiration', 'web design', 'web development'],
 },
 {
   type: 'link',
   href: 'https://css-tricks.com',
   title: 'CSS-Tricks',
   content: 'CSS-Tricks is a great website for exploring code snippets, as well as learning new techniques and tricks. It is particularly useful for those new to the world of web design and CSS.',
   tags: ['css', 'web design', 'code snippets'],
 },
 {
   type: 'link',
   href: 'https://uxmovement.com',
   title: 'UX Movement',
   content: 'UX Movement is a blog that focuses on user experience in web design. It provides insights into the latest and best UX trends and design code of practice.',
   tags: ['ux', 'web design', 'user experience'],
 },
 {
   type: 'link',
   href: 'https://alistapart.com',
   title: 'A List Apart',
   content: 'A List Apart is a resource site that provides news on web design best practices and current standards. It is one of the oldest I’ve come across, originally founded in 1998.',
   tags: ['web design', 'best practices', 'standards'],
 },
 {
   type: 'link',
   href: 'https://colors.adobe.com/create/color-wheel',
   title: 'Adobe Color CC',
   content: 'Adobe Color CC is a color exploration and creation tool that helps you create, save, and share colors. It’s a great tool for designers to create and share color palettes.',
   tags: ['color', 'palette', 'design'],
 },
 {
   type: 'link',
   href: 'https://www.figma.com',
   title: 'Figma',
   content: 'Figma is a vector graphics editor and prototyping tool which is primarily web-based, with additional offline features enabled by desktop applications for macOS and Windows.',
   tags: ['design', 'prototyping', 'vector graphics'],
 },
{
  type: 'link',
  href: 'https://paletton.com/#uid=54q0K0ka-HW2oYx6eRIf6wxjEra',
  title: 'Paletton',
  content: 'One of the coolest color scheme generators I have ever used - check it out',
  tags: ['color', 'scheme', 'palette'],
}
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
    content: 'Command line tool for frequent gitters - easy review and commit.',
    tags: ['python', 'cli', 'git', 'terminal'], 
  },
    {
    type: 'project',
    href: '/projects/etherable',
    title: 'Etherable',
    content: 'Web based educational platform for solidity, ethereum and smart-contract development, powered by blockchain',
    tags: ['ethereum', 'solidity', 'NFT', 'token', 'education', 'erc', 'jsonrpc', 'material-ui', 'markdown', 'technical writing'], 
  },
     {
    type: 'project',
    href: '/projects/peeq',
    title: 'peeq',
    content: 'VSCode extension for clean workspaces. Filter and hide unwanted files and folders and focus on what matters.',
    tags: ['typescript', 'vscode', 'extension', 'nodejs', 'electron'], 
  },

]

const sites:Searchable[] = [
  {
    type: 'site',
    href: 'https://mint.chiptosnft.com/',
    title: 'Chiptos Limited NFT',
    content: 'Custom storefront for limited time NFT sale. Made with Vite, React and ',
    tags: ['typescript', 'vscode', 'extension', 'nodejs', 'electron'], 
  },
  {
    type: 'site',
    href: 'https://therollingpins.com/',
    title: 'The Rolling Pins',
    content: 'Beautiful homepage for niche high-end bakery and kitchen',
    tags: ['tailwind', 'react', 'nextjs'], 
  },
  {
    type: 'site',
    href: 'https://portfolio-delta-4-1z4d6jxfw-pratiqdev.vercel.app/',
    title: 'My Previous Portfolio',
    content: 'My last portfolio - hyper minimal design - built with swiper, simplex-noise and css',
    tags: ['css', 'react', 'nextjs', 'pattern-generation'], 
  }
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
   {
    type: 'image',
    href: '/images/pratiqdev-logo',
    title: 'Logo for pratiqdev',
    content: 'Simple graphic art for my logo. Made from my initials',
    tags: ['logo', 'graphic-design'],
  },
]

const searchableItems:Searchable[] = [
  ...links,
  ...pages,
  ...projects,
  ...blogs,
  ...socials,
  ...images,
  ...sites,
]


export const synonyms = {
  type: ['type', 'subject', 'category'],
  page: ['page', 'path', 'route', 'section'],
  href: ['href', 'external', 'link'],
  title: ['title', 'heading', 'banner'],
  tags: ['tags', 'hashtag', 'hash', '#'],
  content: ['content', 'body', 'text'],
  blog: ['blog', 'article', 'research']
}

export const fuseKeyConfig: FuseOptionKey<Searchable>[] = [
   {
    name: 'type',
    weight: 1.1,
    getFn: (x) => x.type,
  },
  {
    name: 'title',
    weight: 1,
    getFn: (x) => x.title,
  },
  {
    name: 'tags',
    weight: 1.,
    getFn: (x) => x.tags ?? [],
  },
  {
    name: 'href',
    weight: 1,
    getFn: (x) => x.href,
  },
  {
    name: 'content',
    weight: 1,
    getFn: (x) => x.content,
  },
  
]

export const fuseConfig = {
  keys: fuseKeyConfig,
  minMatch: 3,
  extended: true,
  ignoreFieldNorm: false,
  fieldNormWeight: .2,
  findAllMatches: true,
  threshold:1
}

export const curatedSuggestions = {
  primary: ['contact', 'projects', 'blog', '/about', 'react', 'next.js', 'api'],
  secondary: [ 'react', 'nextjs', 'node', 'python', 'golang', 'api', 'docker', 'image', 'css', 'html', 'sql', 'aws', 'mongodb', 'search', 'image', 'link'],
}


export default searchableItems