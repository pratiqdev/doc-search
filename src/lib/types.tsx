export type Searchable = {

  /** The icon to display with this item */
  type: 'page' | 'blog' | 'link' | 'hash' | 'image' | 'project' | 'github' | 'instagram' | 'linkedin' | 'twitter' | 'wyzant' | 'site';

  /** DISPLAY: A path-like string that represents the route where you can find this info or a short description */
  title: string;

  /** Path to item */
  href: string;

  /** Any text content to be matched */
  content: string;
  
  /** Any tag strings to be matched */
  tags?: string[];
}