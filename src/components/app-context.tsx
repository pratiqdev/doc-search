"use client"
import React, { createContext, useContext, ReactNode } from 'react';

export type AppContextValues = {
    menuOpen:boolean;
    otherVal: string;
}
export type AppContextSetter = React.Dispatch<React.SetStateAction<AppContextValues>>
export type AppContextUpdater = (newValues:Partial<AppContextValues> | ((prevState:AppContextValues) => Partial<AppContextValues>)) => void;

export type AppContext = {
  appContext: AppContextValues;
  setAppContext: AppContextSetter;
  updateAppContext: AppContextUpdater;
}

const defaultAppContext:AppContextValues = {
    menuOpen: false,
    otherVal: 'ayo',
}

const MyContext = createContext<AppContext | undefined>(undefined);


export const useAppContext = ():AppContext => {
  const context = useContext(MyContext);
  if (!context) {
    throw new Error('useMyContext must be used within a MyContextProvider');
  }
  return context;
};




export const AppContextProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [appContext, setAppContext] = React.useState<AppContextValues>(defaultAppContext);

  const updateAppContext:AppContextUpdater = (newValues:Partial<AppContextValues> | ((prevState:AppContextValues) => Partial<AppContextValues>)) => {
    if(typeof newValues === 'function'){
      setAppContext((prevState:AppContextValues) => {
        const updater = newValues as (prevState:AppContextValues) => Partial<AppContextValues>;
        const updatedValues = updater(prevState);
        
        return {
          ...prevState,
          ...updatedValues
        }
      })
    }else if(typeof newValues === 'object'){
      setAppContext(currentState => ({...currentState, ...newValues }))
    }
  }
  

  return (
    <MyContext.Provider value={{ appContext, setAppContext, updateAppContext }}>
      {children}
    </MyContext.Provider>
  );
};
