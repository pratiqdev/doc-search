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
import { Switch } from "@/components/ui/switch"
import { motion, AnimatePresence } from 'framer-motion'
 

import { useState } from "react"
import { Input } from "./ui/input"
import { cn } from "@/lib/utils"
import { LucideIcon, SearchIcon,XIcon, FileText, ExternalLink, FileQuestion, HashIcon, ImageIcon, TerminalSquare, GithubIcon, TwitterIcon, Linkedin, Instagram, X, Headphones, GraduationCap, BookOpenText, Trash2Icon, Globe } from "lucide-react"
import Fuse from 'fuse.js'
import type { FuseResult, FuseResultMatch } from "fuse.js"
import { Searchable } from "@/lib/types"
import { getRandArrItem } from "@/lib/utils"
import { fuseConfig, fuseKeyConfig, synonyms, curatedSuggestions } from "@/lib/searchable"


export type AnyRecordIndex = { 
  [key: string]: any; 
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








// &                                                                                                                                                                                                      
// export interface SearchProps
//   extends React.InputHTMLAttributes<HTMLInputElement> {
//     fullWidth?: boolean;
//     searchable: Record<string, any>[]
//   }
type SearchProps = React.InputHTMLAttributes<HTMLInputElement> & {
    fullWidth?: boolean;
    searchable: Searchable[]
  }
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
    useExtendedSearch: fuseConfig.extended,
    minMatchCharLength: fuseConfig.minMatch,
    ignoreFieldNorm: fuseConfig.ignoreFieldNorm,
    // increase the importance of shorter text samples
    fieldNormWeight: fuseConfig.fieldNormWeight,
    findAllMatches: fuseConfig.findAllMatches,
    threshold: fuseConfig.threshold,
    keys: fuseConfig.keys,
  }), [searchable])

  const searchMatch = (matches:string[] = [], optionalNegators:string[] = []):boolean => {
    return (
      matches.length > 0 &&
      matches.some((match) => searchValue.includes(match)) &&
      (optionalNegators.length === 0 || optionalNegators.every((neg) => !searchValue.includes(neg)))
    );
  } 




  // &                                                                                                                                                                                                      
  const SearchResult = ({  score, matches, item }: FuseResult<Searchable>) => {

    const temp:Searchable & AnyRecordIndex = { ...item }


    const handleAction = () => {
      console.log('search result action:', item.href)
    }

    let icon: React.ReactNode;
        switch (item.type) {
          case 'page': icon = <FileText  className=""/>; break;
          case 'blog': icon = <BookOpenText  className={cn("", searchMatch(['blog', 'article', 'research']) && 'text-indigo-600')} />; break;
          case 'link': icon = <ExternalLink  className={cn("", searchMatch(['link'], ['linked']) && 'text-indigo-600')} />; break;
          case 'hash': icon = <HashIcon  className=""/>; break;
          case 'image': icon = <ImageIcon  className={cn("", searchMatch(['image', 'img', 'media'], ['insta']) && 'text-indigo-600')}  />; break;
          case 'project': icon = <TerminalSquare  className={cn("", searchMatch(['proj']) && 'text-indigo-600')} />; break;
          case 'github': icon = <GithubIcon  className={cn("", searchMatch(['gith', 'social', 'contact', 'prof', 'dev', 'pratiqdev']) && 'text-indigo-600')}  />; break;
          case 'twitter': icon = <TwitterIcon  className={cn("", searchMatch(['twitt', 'social', 'contact', 'pratiqdev']) && 'text-indigo-600')} />; break;
          case 'linkedin': icon = <Linkedin  className={cn("", searchMatch(['linked', 'social', 'contact', 'prof', 'jannetta']) && 'text-indigo-600')} />; break;
          case 'instagram': icon = <Instagram  className={cn("", searchMatch(['insta', 'social', 'contact', 'prof', 'dev']) && 'text-indigo-600')}  />; break;
          case 'wyzant': icon = <GraduationCap  className={cn("", searchMatch(['wyz', 'social', 'contact', 'prof', 'dev']) && 'text-indigo-600')}  />; break;
          case 'site': icon = <Globe  className={cn("", searchMatch(['site', 'app']) && 'text-indigo-600')}  />; break;
          default: icon = <FileQuestion  className="" />; 
        }

        let section = temp.type as string 

        // swap out social types for text 'social'
        if(['wyzant', 'twitter', 'github', 'linkedin', 'instagram'].some(x => x === type)){
          section = 'social'
        }

        matches?.forEach(({indices, key, value}) => {
          if(!key || key === 'type') return

          let k = Array.isArray(key)
            ? key[0]
            : key.includes(',') ? key.split(',')[0] ?? '' : key

          // Replace the matched part of the string with a <span> element
          temp[k] = value?.replace(
            new RegExp(`(${indices.map(([start, end]) => value?.slice(start, end + 1)).join('|')})`, 'g'),
            '<span class="text-indigo-600 underline">$1</span>'
          );

          console.log(`key highlighted '${k}':`, temp[k]); // Log the replaced string
        });

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
          <p className="font-regular tracking-wide" dangerouslySetInnerHTML={{ __html: temp.title  }} />
          <p className="font-light tracking-wide truncate whitespace-nowrap h-4" dangerouslySetInnerHTML={{ __html: temp.content  }} />
        </div>
      </div>
    )
  }


  const SuggestionComponent = ({ key, value }: { key: number, value: string }) => {
    return(
      <Button onClick={() => setSearchValue(value)} key={key} variant="link">{value}</Button>
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

  React.useEffect(() => {
    if(dialogOpen){ 
      try{
        if(!inputRef.current){
          console.log('focus error: no current inputRef:', inputRef.current)
          return
        }
        inputRef.current.focus() 
      }catch(err){
console.log('focus error:', err)
      }
    }
  }, [dialogOpen])


      

  // &                                                                                                                                                                                                      
  return (
    <>
    <Dialog  open={dialogOpen} onOpenChange={(b) => { setDialogOpen(b); inputRef?.current?.focus() }} >
      <DialogTrigger asChild>
      <div className="relative flex items-center max-w-min border-red-500 cursor-text" >
        <Input type="text" placeholder="Search" value={searchValue} className={cn('relative w-auto min-w-24 z-0')} 
          onChange={(event: React.ChangeEvent<HTMLInputElement>) => { setSearchValue(event.target.value); setDialogOpen(true); inputRef.current?.focus() }} 
        />
        <SearchIcon className="absolute left-[.8rem] h-4"/>
        <XIcon className={cn("absolute right-[.8rem] h-6 w-6 p-1 rounded-full opacity-0 duration-200 pointer-events-none cursor-pointer hover:bg-indigo-200", 
          searchValue.length && "opacity-100 pointer-events-auto"
        )}
          onClick={handleClear}
        />
      </div>
      </DialogTrigger>
      <DialogContent   className="sm:max-w-[425px] max-w-[800px] bg-slate-50 rounded-lg md:rounded-lg  flex flex-col items-center gap-1 p-4">
          {/* <DialogTitle className="text-left w-full p-1 mb-1">Search content</DialogTitle> */}
        
 

        {/* //+ Real Search Input */}
        <div className="relative flex items-center w-full z-2 h-full" >
          <SearchIcon className="absolute left-[.8rem] h-4 text-slate-600 z-10"/>
          <Input 
            ref={inputRef} 
            tabIndex={0}
            type="text" 
            placeholder="Search" 
            autoFocus
            value={searchValue} 
            onChange={(event: React.ChangeEvent<HTMLInputElement>) => setSearchValue(event.target.value)} 
            onKeyDown={(event: React.KeyboardEvent) => onEnter(event, () => {
              let action =  searchResults?.[0]?.item?.href
              console.log('input auto action (first item)', action)
            }) }
            className={cn('relative w-full')}
          />
          <Trash2Icon 
            tabIndex={1} className={cn("absolute z-10 right-[2.2rem] h-6 w-6 p-1 rounded-full opacity-0 duration-200 pointer-events-none cursor-pointer text-slate-600 hover:bg-indigo-200 hover:text-black", 
            searchValue.length && "opacity-100 pointer-events-auto"
          )}
            onClick={handleClear}
            onKeyDown={(event) => onEnter(event, handleClear)} 

          />
          <XIcon tabIndex={2} className={cn("absolute right-[.8rem] h-6 w-6 p-1 z-10 rounded-full cursor-pointer hover:bg-indigo-200 text-slate-600 hover:text-black")}
            onClick={handleClose}
            onKeyDown={(event) => onEnter(event, handleClose)} 

          />
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
              tabIndex={3} 
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
              {[ ...getRandArrItem(curatedSuggestions.primary, 1), ...getRandArrItem(curatedSuggestions.secondary, 2) ].map((x:string, idx:number) => <SuggestionComponent key={idx} value={x} />)}
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
