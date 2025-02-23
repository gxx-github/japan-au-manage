import * as React from "react";
import { createContext, ReactNode, useState } from "react";

interface NftItemProps {
  info: string;
  nft_name: string;
  nft_address: string;
  logo: string;
  start_timestamp: number;
  end_timestamp: number;
}
export const InfoContext = createContext({});
const InfoProvider = ({ children }: { children: ReactNode }): JSX.Element => {
   const [NftInfo, setNftInfo] = useState({} as NftItemProps)
   const [curChooise, setcurChooise] = useState(0)




   
    return (
        <InfoContext.Provider value={{
            NftInfo, setNftInfo,
            curChooise, setcurChooise
        }}>
            {children}
        </InfoContext.Provider>
    );
};

export default InfoProvider
