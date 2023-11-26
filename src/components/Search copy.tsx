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


const curatedSuggestions = ['contact', 'projects', 'blog', 'about', 'pratiqdev', 'react', 'nextjs', 'node', 'python', 'golang', 'api', 'docker', 'image', 'css', 'html', 'sql', 'aws', 'mongodb']

// &                                                                                                                                                                                                      
const Search = React.forwardRef<HTMLInputElement, SearchProps>(
({ className, type, fullWidth = false, searchable, ...props }, ref) => {
      
  const [searchValue, setSearchValue] = useState('')
  const [strictMode, setStrictMode] = useState(false)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [searchResults, setSearchResults] = useState<Array<SearchResult & Filterable>>([])
  const [suggestions, setSuggestions] = useState<string[]>([])
  const inputRef = React.useRef<null | HTMLInputElement>(null)

  const minSearchLength = 2
  const contextPreLength = 0
  const contextPostLength = 100
  const maxSuggestionCount = 3



  // &                                                                                                                                                                                                      
  const SearchResult = ({ title, subtitle, icon, context, href, score, matches }: SearchResult & Filterable) => {
    const handleAction = () => {
      console.log('search result action:', href)
    }
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
        <div className="flex flex-col overflow-hidden text-xs">
          {/* <pre>{matches.join()}</pre> */}
          <p className="font-regular tracking-wide" dangerouslySetInnerHTML={{ __html:highlightWord(`${title}`, searchValue)  }} />
          <p className="font-light tracking-wide truncate whitespace-nowrap h-4" dangerouslySetInnerHTML={{ __html:highlightWord((subtitle) ?? '', searchValue)  }} />
          <p className="font-light tracking-wide truncate whitespace-nowrap h-4" dangerouslySetInnerHTML={{ __html:highlightWord((context) ?? '', searchValue)  }} />
          {/* <p className="font-light tracking-wide truncate whitespace-nowrap h-4" dangerouslySetInnerHTML={{ __html:highlightWord((context?.length && context.length > 1 ? context : subtitle) ?? '', searchValue)  }} /> */}
        </div>
      </div>
    )
  }


    // create a unique array of strings based on the searchable content.
  // &                                                                                                                                                                                                      
  const termSuggestions =  React.useMemo(() => Array.from( new Set( 
      // split at spaces and commas, 
      searchable.map((item:Searchable) => {

        // console.log('termSuggestions | converting item to string:', item)
        let res = createSearchableString(item).split(/[ ,/]+/g)
        // console.log('termSuggestions | resulting strings:', res)
        return res
      }).flat() 
        // only words with length between 2 and 18
      ) ).filter(item => {
          // console.log('termSuggestions | checking item length:', item)
        
        return item.length > 2 && item.length < 18
      })
      // remove all trailing periods and flatter the array
      .map(item => {
          // console.log('termSuggestions | replacing trailing period from item:', item)
          
          let res = item.replace(/\.$/, '')
          // console.log('termSuggestions | replacing trailing period res:', res)
          return res.trim()
      })
  , [searchable])


  type Filterable = { score: number, strictMatch:boolean, looseMatch:boolean, matches: string[] }

  const countOccurrences = (word:string, string:string):number => {
     let n = 0;
     let position = 0;
     while (true) {
       position = string.indexOf(word, position);
       if (position !== -1) {
         n++;
         position += word.length;
       } else {
         break;
       }
     }
     return n;
   }


  // &                                                                                                                                                                                                      
  const filterResults = React.useCallback((value: string): Array<SearchResult & Filterable>  => {
    if(!value || value.length < minSearchLength) return []
    
    
    // function filterAndRank(searchValue: string): Searchable[] {
      // Split search value into individual words
      const searchWords = value.toLowerCase().split(' ').filter(Boolean)
      console.log('filtering for:', searchWords)

      // Filter array based on matching criteria
      const filteredArray: Array<Searchable & Filterable> = searchable.map(item => {
        // const itemText = `${item.title} ${item.content} ${item.tags?.join(' ')}`.toLowerCase();
        const itemText = createSearchableString(item)
        const looseMatch = searchWords.some(word => itemText.includes(word))
        const strictMatch = searchWords.every(word => itemText.includes(word))

        return {
          ...item,
          strictMatch,
          looseMatch,
          score: 0,
          matches: [],
        } as Searchable & Filterable

        // Check if all search words are present in the item
        // return strictMode ? strictMatch : looseMatch
      });


      const scoredArray = filteredArray.map(item => {
        searchWords.forEach(word => {
          item.matches.push(`[${word}]`)
        if(item.strictMatch){
           item.score += strictMode ? 20 : 10
           item.matches.push('strict')
          }
          if(item.looseMatch) {
            item.score += 5 
            item.matches.push('loose')
        }

          console.log('scoring for word:', word)
          if(createSearchableString(item.title).includes(word) ) {
            item.score += 50
           item.matches.push('title')
          }

          if(item.tags && createSearchableString(item.tags).includes(word) ) {
            item.score += 10
           item.matches.push('tags')
          }
          let occ = countOccurrences(word, createSearchableString(item.content))
          item.matches.push(`occ:${occ}`)
          item.score += occ
        })
        // item.score += searchWords.reduce((count, word) => count + (( item.content.includes(word) ? 1 : 0) ), 0);

        return item
      })

      // Rank the filtered array based on the number of matching criteria
      const rankedArray = scoredArray.sort((a, b) => {
        return b.score - a.score; // Sort in descending order of matches
      });
      

      return rankedArray.map((searchableItem: Searchable & Filterable): SearchResult & Filterable => {

        const itemText = createSearchableString(searchableItem.content, searchableItem.tags, searchableItem.href)

        
        // Create a dynamic regular expression
        const escapedWord = searchValue.replace(/[#.*+?^${}()|[\]\\]/g, "\\$&");
        const regex = new RegExp(`\\S*${escapedWord}(.{0,${contextPostLength}})`);
        let matchContext = searchableItem.content

        // Test if the string matches the regular expression
        if (regex.test(itemText)) {
            // Use the match method to get the matched substring and surrounding text
            let ctx = itemText.match(regex)?.[0] ?? ' Failed context match...'
            
            let ctxArr = ctx.split(' ')
            matchContext = ctxArr.splice(0, ctxArr.length).join(' ')


        }


        // Determine the icon based on the type (you may need to customize this based on your icon system)
        let icon: React.ReactNode;
        switch (searchableItem.type) {
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

        let section = searchableItem.type as string

        // swap out social types for text 'social'
        if(['wyzant', 'twitter', 'github', 'linkedin', 'instagram'].some(x => x === searchableItem.type)){
          section = 'social'
        }

        // Create and return the SearchResult object
        return {
          title: searchableItem.title,
          subtitle: searchableItem.content,
          context: matchContext,
          icon,
          href: searchableItem.href,
          section,
          score: searchableItem.score,
          strictMatch: searchableItem.strictMatch,
          looseMatch: searchableItem.looseMatch,
          matches: searchableItem.matches
        };
      })

      .filter(item => item.score > 0)
     
    // }





    // return [{
    //   title: 'A result',
    //   subtitle: 'ope',
    //   icon: XIcon,
    //   href: '',
    //   section: 'Ayope'
    // }]
    
  }, [searchable, searchValue, strictMode])
      


      
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
    setSearchResults(filterResults(searchValue.trim()))
    // only update suggestions if there is a searchValue
    setSuggestions((searchValue && searchValue.length) 
      ? termSuggestions.filter((term:string, index:number) => {
          console.log('suggest | matching suggestions for:', `"${searchValue}"`)
          
          return term.startsWith(searchValue.trim().includes(' ') ? searchValue.trim().split(' ')[1] : searchValue.trim()) 
          // dont show suggestions for identical matches
          && term !== searchValue
          && searchValue.split(' ')?.every(singleSearchValue => singleSearchValue !== term)
          
          // limit visible suggestions
        }).filter((_, idx) => idx < maxSuggestionCount)
      : []
    )
  }, [strictMode, searchValue, filterResults, termSuggestions])


      

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
      <DialogContent className="sm:max-w-[425px] max-w-[600px] bg-slate-50 rounded-lg md:rounded-lg  flex flex-col items-center gap-1 p-4">
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
              {getRandomItems(termSuggestions, 3).map((x:string, idx:number) => <Button onClick={() => setSearchValue(x)} key={idx} variant="link">{x}</Button>)}
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

              {searchResults.map((result:SearchResult & Filterable, index:number) => 
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
