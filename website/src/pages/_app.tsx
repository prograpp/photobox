import { Component_Nav } from "@/components/nav";
import { ajax } from "@/lib/ajax";
import { Box, Divider, Group, MantineProvider, ScrollArea } from "@mantine/core";
import { ModalsProvider } from "@mantine/modals";
import { Notifications, showNotification } from "@mantine/notifications";
import type { AppProps } from "next/app";
import React, { useEffect } from "react";

const App: React.FC<AppProps> = (props) => {
  useEffect(() => {
    ajax.on("*", () => {
      console.error("no defined callback");
      showNotification({
        message: "Die gewählte Aktion konnte nicht ausgeführt werden.",
        color: "red",
      });
    });
  }, []);

  return (
    <MantineProvider theme={{ colorScheme: "dark" }} withGlobalStyles>
      <Notifications />

      <ModalsProvider>
        <Group noWrap>
          <Component_Nav />

          <Divider orientation="vertical" />

          <Box sx={{ height: "calc(100vh - 16px)", flexGrow: 1 }}>
            <ScrollArea h="100%">
              <props.Component {...props.pageProps} />
            </ScrollArea>
          </Box>
        </Group>
      </ModalsProvider>
    </MantineProvider>
  );
};

export default App;
