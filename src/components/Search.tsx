import * as React from "react"
import { Button } from "./ui/button"
import {
Dialog,
DialogContent,
DialogDescription,
DialogFooter,
DialogHeader,
DialogTitle,
DialogTrigger,
} from "@/components/ui/dialog"
import { debounce } from 'lodash-es'
       import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { motion, AnimatePresence } from 'framer-motion'
import { ReactSearchAutocomplete } from 'react-search-autocomplete'
 

import { useState } from "react"
import { Input } from "./ui/input"
import { cn } from "@/lib/utils"
import { LucideIcon, SearchIcon,XIcon, FileText, ExternalLink, FileQuestion, HashIcon, ImageIcon, TerminalSquare, GithubIcon, TwitterIcon, Linkedin, Instagram, X, Headphones, GraduationCap, BookOpenText, Trash2Icon } from "lucide-react"
import Fuse from 'fuse.js'
import type { FuseResult, FuseResultMatch } from "fuse.js"

export type Searchable = {

  /** The icon to display with this item */
  type: 'page' | 'blog' | 'link' | 'hash' | 'image' | 'project' | 'github' | 'instagram' | 'linkedin' | 'twitter' | 'wyzant';

  /** DISPLAY: A path-like string that represents the route where you can find this info or a short description */
  title: string;

  /** Path to item */
  href: string;

  /** Any text content to be matched */
  content: string;
  
  /** Any tag strings to be matched */
  tags?: string[];
}

export type SearchResult = {
  title: string;
  subtitle: string;
  context?: string;
  icon: React.ReactNode;
  href: string;
  /** section represent where this should appear - is it a search result, suggested result, or 'under the hood'? */
  section: string;
}


export interface SearchProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
    fullWidth?: boolean;
    searchable: Searchable[]
  }

const trimText = (text:string, maxLength: number = 40) => {
  if (text.length <= maxLength) {
    return text;
  } else {
    return text.slice(0, maxLength - 3) + '...';
  }
};

const capitalizeFirstLetter = (str:string) => {
    // Check if the input string is not empty
    if (str.length === 0) {
        return str;
    }

    // Capitalize the first letter and concatenate it with the rest of the string
    return str.charAt(0).toUpperCase() + str.slice(1);
}

const createSearchableString = (...values:any[]):string => {
  return values.map((value) => {
    if (typeof value === 'string' || typeof value === 'number') {
      return value.toString();
    } else if (Array.isArray(value)) {
      return '#' + value.join(' #');
    } else if (typeof value === 'object' && value !== null) {
      // Convert object values to a string representation
      return Object.values(value).join(' ');
    } else {
      return '';
    }
  }).join(' ').toLowerCase();
};

const highlightWord = (text:string, value:string) => {
  if (!text || !value) {
    return text ?? ''
  }

  const regex = new RegExp(`(${value.split(' ').sort((a, b) => b.length - a.length).join('|')})`, 'gi');
  return text.replace(regex, match => `<span class="text-indigo-600 font-semibold">${match}</span>`);
};

const getRandomItems = (array:any[], number:number) => {
  const shuffledArray = array.sort(() => Math.random() - 0.5); // Shuffle the array
  return shuffledArray.slice(0, number); // Get the first 'number' items
};

type Filterable = { score: number, strictMatch:boolean, looseMatch:boolean, matches: string[] }

const curatedSuggestions = ['contact', 'projects', 'blog', 'about', 'pratiqdev', 'react', 'nextjs', 'node', 'python', 'golang', 'api', 'docker', 'image', 'css', 'html', 'sql', 'aws', 'mongodb']

// &                                                                                                                                                                                                      
const Search = React.forwardRef<HTMLInputElement, SearchProps>(
({ className, type, fullWidth = false, searchable, ...props }, ref) => {
      
  const [searchValue, setSearchValue] = useState('')
  const [strictMode, setStrictMode] = useState(false)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [searchResults, setSearchResults] = useState<FuseResult<Searchable>[]>([])
  const [suggestions, setSuggestions] = useState<string[]>([])
  const inputRef = React.useRef<null | HTMLInputElement>(null)

  const minSearchLength = 2
  const contextPreLength = 0
  const contextPostLength = 100
  const maxSuggestionCount = 3

  const fuse = React.useMemo(() => new Fuse(searchable, {
    includeScore: true,
    includeMatches: true,
    useExtendedSearch: true,
    minMatchCharLength: 1,
    findAllMatches: true,
    keys: ['title', 'content', 'href', 'tags'],
  }), [searchable])


  const renderHighlightedText = (text:string, matches:FuseResultMatch[]) => {
    const parts = [];
    let lastIndex = 0;

    matches.forEach((match) => {
      const [start, end] = match.indices[0];
      const prefix = text.slice(lastIndex, start);
      const matchText = text.slice(start, end + 1);

      parts.push(prefix);
      parts.push(<span className="highlight">{matchText}</span>);

      lastIndex = end + 1;
    });

    parts.push(text.slice(lastIndex));

    return <span>{parts}</span>;
  };


  // &                                                                                                                                                                                                      
  const SearchResult = ({  score, matches, item }: FuseResult<Searchable>) => {

    const handleAction = () => {
      console.log('search result action:', item)
    }

    let icon: React.ReactNode;
        switch (item.type) {
          case 'page': icon = <FileText  className=""/>; break;
          case 'blog': icon = <BookOpenText  className="" />; break;
          case 'link': icon = <ExternalLink  className=""/>; break;
          case 'hash': icon = <HashIcon  className=""/>; break;
          case 'image': icon = <ImageIcon  className="" />; break;
          case 'project': icon = <TerminalSquare  className="" />; break;
          case 'github': icon = <GithubIcon  className="" />; break;
          case 'twitter': icon = <TwitterIcon  className=""/>; break;
          case 'linkedin': icon = <Linkedin  className=""/>; break;
          case 'instagram': icon = <Instagram  className="" />; break;
          case 'wyzant': icon = <GraduationCap  className="" />; break;
          default: icon = <FileQuestion  className="" />; 
        }

        let section = item.type as string

        // swap out social types for text 'social'
        if(['wyzant', 'twitter', 'github', 'linkedin', 'instagram'].some(x => x === type)){
          section = 'social'
        }

        matches?.forEach((match:FuseResultMatch) => {
          if(!match.key || !match.indices) return;
          let key = match.key
          if(!key || item[key]){
            console.log(`matches | error: no key? '${key}'`, match)
            return
          }
          console.log(`matches | Parsing matches for '${item[key]}'-'${item.title}':'${key}'`)
          match.indices.forEach(indc => {
            let value = item[key] ?? 'no-key'
            let [start, end] = indc
            console.log(`matches | replacing indices [${start}, ${end}]`)
            console.log(`matches | original value '${value}'`)
            let chunk = value.slice(start, end) ?? 'no-chunk'
            console.log(`matches | extracted chunk '${chunk}'`)
            item[key] = (item[key] as string).split('').toSpliced(start, end-start, `<span className="text-red-500">${chunk}</span>`).join('') ?? 'oops-result'
          })
        })

        console.log('matches:', item.title, searchValue, {matches , item})
    return (
      <div
         className="flex items-center rounded-[.5rem] bg-white p-2 py-1 mx-[2px] text-sm mt-1 hover:bg-indigo-50 duration-200 flex-1 cursor-pointer group/result" 
        onClick={handleAction} 
        onKeyDown={(event) => onEnter(event, handleAction)}
        tabIndex={0}
        >
        <div className="h-8 w-8 min-w-[2rem] flex items-center text-slate-500 group-hover/result:text-indigo-500">
          {/* {score} */}
          {icon}
        </div>
        <div className="flex flex-col text-xs overflow-hidden">
          {/* <pre>{JSON.stringify(item)}</pre> */}
          {/* <pre>{JSON.stringify(matches)}</pre> */}
          <p className="font-regular tracking-wide" dangerouslySetInnerHTML={{ __html: result.title  }} />
          <p className="font-light tracking-wide truncate whitespace-nowrap h-4" dangerouslySetInnerHTML={{ __html: result.content  }} />
          {/* <p className="font-light tracking-wide truncate whitespace-nowrap h-4" dangerouslySetInnerHTML={{ __html:highlightWord((context) ?? '', searchValue)  }} /> */}
          {/* <p className="font-light tracking-wide truncate whitespace-nowrap h-4" dangerouslySetInnerHTML={{ __html:highlightWord((context?.length && context.length > 1 ? context : subtitle) ?? '', searchValue)  }} /> */}
        </div>
      </div>
    )
  }





      
  // &                                                                                                                                                                                                      
  const handleClose = (event:any) => {
    event.stopPropagation()
    setDialogOpen(false)
  }

  const handleClear = () => {
    setSearchValue('')
    inputRef.current && inputRef.current.focus()
  }

  



  // &                                                                                                                                                                                                      
  const onSuggestionSelected = (term:string) => {
    setSearchValue(currentValue => {
      console.log('suggest | currentValue:', currentValue)
      let wordArr = currentValue.split(' ') ?? []
      let wordCount = wordArr?.length

      if (wordCount > 1 && wordArr[wordCount].length > 0) {
        console.log('suggest | current value has multiple words:', currentValue.split(' ').length)
        wordArr[wordCount - 1] = term
        return wordArr.join(' ')
        // return currentValue.split(' ').splice(-1, 1, term).join(' ') 
      }else{
        return term 
      }
    })
    inputRef.current && inputRef.current.focus()
  }


  const onEnter = (event: React.KeyboardEvent, cb:Function) => {
    event.key === 'Enter' && cb()
  }
      
      
  // &                                                                                                                                                                                                      
  React.useEffect(() => {
    let res = fuse.search(searchValue)
    console.log('search results:', res)
    setSearchResults(res)
  }, [strictMode, searchValue, fuse])


      

  // &                                                                                                                                                                                                      
  return (
    <>
    <Dialog  open={dialogOpen} onOpenChange={(b) => { setDialogOpen(b); inputRef?.current?.focus() }}>
      <DialogTrigger asChild>
      <div className="relative flex items-center max-w-min border-red-500 cursor-text" >
        <Input type="text" placeholder="Search" value={searchValue} className={cn('relative w-auto min-w-24 z-0 pointer-events-none')}/>
        <SearchIcon className="absolute left-[.8rem] h-4"/>
        <XIcon className={cn("absolute right-[.8rem] h-6 w-6 p-1 rounded-full opacity-0 duration-200 pointer-events-none cursor-pointer hover:bg-indigo-200", 
          searchValue.length && "opacity-100 pointer-events-auto"
        )}
          onClick={handleClear}
        />
      </div>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] max-w-[800px] bg-slate-50 rounded-lg md:rounded-lg  flex flex-col items-center gap-1 p-4">
          {/* <DialogTitle className="text-left w-full p-1 mb-1">Search content</DialogTitle> */}
        
 

        {/* //+ Real Search Input */}
        <div className="relative flex items-center w-full z-2 h-full" >
          <SearchIcon className="absolute left-[.8rem] h-4 text-slate-600 z-10"/>
          <Trash2Icon tabIndex={0} className={cn("absolute z-10 right-[2.2rem] h-6 w-6 p-1 rounded-full opacity-0 duration-200 pointer-events-none cursor-pointer text-slate-600 hover:bg-indigo-200 hover:text-black", 
            searchValue.length && "opacity-100 pointer-events-auto"
          )}
            onClick={handleClear}
            onKeyDown={(event) => onEnter(event, handleClear)} 

          />
          <XIcon tabIndex={0} className={cn("absolute right-[.8rem] h-6 w-6 p-1 z-10 rounded-full cursor-pointer hover:bg-indigo-200 text-slate-600 hover:text-black")}
            onClick={handleClose}
            onKeyDown={(event) => onEnter(event, handleClose)} 

          />
          <Input ref={inputRef} type="text" placeholder="Search" value={searchValue} 
          onChange={(event: React.ChangeEvent<HTMLInputElement>) => setSearchValue(event.target.value)} 
          className={cn('relative w-full')} />
        {/* <div className="z-10 w-full">

         <ReactSearchAutocomplete
            className={cn("text-slate-700 w-full border-2 border-red-500")}
            items={termSuggestions.map((term, idx) => ({ id: idx, name: term }))}
            inputSearchString={searchValue}
            onSearch={handleOnSearch}
            onHover={handleOnHover}
            onSelect={(item) => onSuggestionSelected(item.name)}
            onFocus={handleOnFocus}
            maxResults={5}
            autoFocus
            />
            </div> */}
        </div>
        <div className="w-full h-4 text-xs text-left pl-[2.6rem] flex gap-0 text-indigo-400  z-10 items-center focus:ring-0">
          {suggestions.map((term, index) => 
            <p 
              tabIndex={0} 
              onClick={() => onSuggestionSelected(term)} 
              // set searchValue on focus - bad result! removes all other suggestions
              // onFocus={(event: React.FocusEvent) => setSearchValue(term)} 
              onKeyDown={(event) => onEnter(event, () => onSuggestionSelected(term))} 
              key={term + index}
               className=" cursor-pointer hover:underline focus:text-indigo-500 hover:text-indigo-500 whitespace-nowrap rounded-full px-1"
              >{term}</p>
          )}
        </div>






        
        <div className="flex flex-col gap-2 w-full flex-1 overflow-auto h-[21rem] max-h-[21rem] min-h-[21rem] pt-2" tabIndex={-1}>

          {(!searchValue) && <div className={cn("text-slate-500 text-center opacity-100 duration-200 h-[21rem] flex flex-col items-center justify-center")}>
            Explore my portfolio with a simple search
            <div className="text-sm">
              {getRandomItems(curatedSuggestions, 3).map((x:string, idx:number) => <Button onClick={() => setSearchValue(x)} key={idx} variant="link">{x}</Button>)}
            </div>
          </div>
          }
          {(searchResults?.length === 0 && searchValue.length > 0) && <p className={cn("text-slate-500 text-center h-[21rem] flex items-center justify-center")}>No Results</p>}
          {(!searchable) && <p className={cn("text-slate-500 text-center h-[21rem] flex items-center justify-center")}>No searchable data</p>}

          {/* {Object.entries(searchResults).map(([category, items]:[string, any]) => (
            <div key={category}>
              <h3 className="text-xs">{capitalizeFirstLetter(category)}</h3>

              {items.map((result:SearchResult & Filterable, index:number) => (
                <SearchResult key={index} {...result} />
              ))}
          
            </div>
          ))} */}

        {/* //& Non categorized results */}
            <div >

              {searchResults.map((result:FuseResult<Searchable>, index:number) => 
                <SearchResult key={index} {...result} />
              )}
          
            </div>

        </div>

        <div className="w-full flex items-end pt-2 ">
        {/* <div className="flex items-center justify-start">
          <Switch tabIndex={-1} id="strict-search" className="scale-[.7]" onCheckedChange={(b) => setStrictMode(b)}/>
          <Label htmlFor="strict-search" className="text-slate-600 font-normal">Exact</Label>
        </div>  */}
        {/* //! Link to a page about how this search was built */}
          <div className="text-xs flex-1 text-right pb-1 text-slate-600 cursor-pointer hover:underline">
              Inspired by <b className="font-semibold text-indigo-600">DocSearch</b>
            </div>
        </div>
        
      </DialogContent>
    </Dialog>

      </>
    )
  }
)
Search.displayName = "Input"

export { Search }
