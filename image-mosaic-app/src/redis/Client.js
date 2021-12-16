import React, { useState, useEffect } from "react";
import redis from 'redis';
import bluebird from 'bluebird';

export const ClientContext = React.createContext();

export const ClientProvider = ({children}) => {
    const [client, setClient] = useState(undefined);

    useEffect(()=>{
        setClient(redis.createClient());
        bluebird.promisifyAll(redis.RedisClient.prototype);
        bluebird.promisifyAll(redis.Multi.prototype);
    }, []);

    return (
        <ClientContext.Provider value={{client}}>
            {{children}}
        </ClientContext.Provider>
    )
}

