import { API_URL } from "@/constants";
import { LoginContext } from "@/context/LoginContext";
import "@/styles/globals.css";
import { MantineProvider } from "@mantine/core";
import type { AppProps } from "next/app";
import { useEffect, useState } from "react";
import { QueryClient, QueryClientProvider } from "react-query";

const client = new QueryClient();

export default function App({ Component, pageProps }: AppProps) {
  const user = useUser();

  if (user === null) return null;

  return (
    <QueryClientProvider client={client}>
      <MantineProvider
        withGlobalStyles
        withNormalizeCSS
        theme={{
          /** Put your mantine theme override here */
          colorScheme: "light",
        }}
      >
        <LoginContext.Provider value={{ isLoggedIn: !(user === false) }}>
          <Component {...pageProps} />
        </LoginContext.Provider>
      </MantineProvider>
    </QueryClientProvider>
  );
}

function useUser() {
  const [user, setUser] = useState<any>(null);

  async function fetchUser() {
    API_URL;
    const res = await fetch(`${API_URL}/user`);
    const data = await res.json();
    if (data.phone) {
      setUser(data);
    } else {
      setUser(false);
    }
  }

  useEffect(() => {
    fetchUser();
  }, []);

  return user;
}
