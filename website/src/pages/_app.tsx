import { Component_Nav } from "@/components/nav";
import { Box, Divider, Group, MantineProvider } from "@mantine/core";
import { ModalsProvider } from "@mantine/modals";
import { Notifications } from "@mantine/notifications";
import type { AppProps } from "next/app";
import React from "react";

const App: React.FC<AppProps> = (props) => {
  return (
    <MantineProvider theme={{ colorScheme: "dark" }} withGlobalStyles>
      <Notifications />

      <ModalsProvider>
        <Group>
          <Component_Nav />

          <Divider orientation="vertical" />

          <Box sx={{ height: "calc(100vh - 16px)", flexGrow: 1 }}>
            <props.Component {...props.pageProps} />
          </Box>
        </Group>
      </ModalsProvider>
    </MantineProvider>
  );
};

export default App;
