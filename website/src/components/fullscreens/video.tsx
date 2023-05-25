import { ActionIcon, Box, Center, Portal } from "@mantine/core";
import { IconX } from "@tabler/icons-react";
import mime from "mime";
import path from "path";
import React from "react";

type Props = {
  path: string[];
  name: string;
  close: () => void;
};

export const Component_Fullscreens_Video: React.FC<Props> = (props) => {
  return (
    <Portal>
      <Box pos="fixed" top={0} left={0} w="100vw" h="100vh" bg="dark.7">
        <ActionIcon pos="absolute" top="1rem" right="1rem" size="xl" color="gray" onClick={props.close}>
          <IconX />
        </ActionIcon>

        <Center w="100%" h="100%">
          <video controls style={{ maxWidth: "100vw", maxHeight: "100vh" }}>
            <source src={`/api/image/full/${path.join(...props.path, props.name)}`} type={mime.getType(props.name) ?? undefined} />
          </video>
        </Center>
      </Box>
    </Portal>
  );
};
