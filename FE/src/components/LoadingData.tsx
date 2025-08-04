"use client";

// Libs
import { ReactNode, createContext, useState } from "react";
import Loading from "./Loading";
// Components, Layouts, Pages
// Others
// Styles, images, icons

type Props = {
  children?: ReactNode;
};

type LoadingDataType = {
  loading: boolean;
  show: () => void;
  hide: () => void;
};

const LoadingData = createContext<LoadingDataType | undefined>(undefined);

const LoadingDataProvider = (props: Props) => {
  //#region Destructuring Props
  const { children } = props;
  //#endregion Destructuring Props

  //#region Declare Hook
  //#endregion Declare Hook

  //#region Selector
  //#endregion Selector

  //#region Declare State
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const value: LoadingDataType = {
    loading: isLoading,
    show: () => setIsLoading(true),
    hide: () => setIsLoading(false),
  };
  //#endregion Declare State

  //#region Implement Hook
  //#endregion Implement Hook

  //#region Handle Function
  //#endregion Handle Function

  return (
    <LoadingData.Provider value={value}>
      {isLoading && <Loading />}
      {children}
    </LoadingData.Provider>
  );
};

export { LoadingData, LoadingDataProvider };
