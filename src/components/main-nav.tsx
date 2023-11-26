"use client"
import { useAppContext } from "@/components/app-context";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ReactNode } from "react";
import { useToast } from "@/components/ui/use-toast"

export const ToastDemo = () => {
  const { toast } = useToast()

  return (
    <Button
      onClick={() => {
        toast({
          title: "Scheduled: Catch up",
          description: "Friday, February 10, 2023 at 5:57 PM",
        })
      }}
    >
      Show Toast
    </Button>
  )
}


export type MenuOption = {
    /** An optional title for this menu section */
    title?: string | ReactNode;

    /** create a horizontal separator between this and the previous menu section */
    separator?: boolean;

    /** single leading icon, similar to context menu layout */
    leadingIcon: ReactNode;
    /** one or more trailing icons - similar to context menu layout  */
    trailingIcons: ReactNode[];

}

const menuOptions = [
    {
        type: 'icons',
    },
    {
        title: '',
    }
]


export type MainNavProps = {
    search?: boolean;
}

const MainNav = (props:MainNavProps) => {
    const {appContext, setAppContext, updateAppContext} = useAppContext()

    return (
        <nav>
            Demo {appContext.menuOpen ? 'open' : 'close'}
            <ThemeToggle />
            <Button onClick={() => updateAppContext(ctx => ({ menuOpen: !ctx.menuOpen })) }>{appContext.menuOpen ? 'Close Menu' : 'Open Menu'}</Button>
            <pre>
                {JSON.stringify(appContext)}
            </pre>
            <ToastDemo />
        </nav>
    )
}

export default MainNav