import { ActionIcon, Box, Center, Portal } from "@mantine/core";
import { IconQuestionMark, IconVideo, IconX } from "@tabler/icons-react";
import mime from "mime";
import Image from "next/image";
import path from "path";
import React, { useMemo, useState } from "react";

type Props = {
  path: string[];
  name: string;
};

export const Component_Previews_Image: React.FC<Props> = (props) => {
  const [fullScreen, setFullScreen] = useState<boolean>(false);

  const mediaType = useMemo<"image" | "video" | null>(() => {
    let mimeType = mime.getType(props.name);

    if (mimeType && mimeType.startsWith("image/")) return "image";
    if (mimeType && mimeType.startsWith("video/")) return "video";
    return null;
  }, [props.name]);

  if (fullScreen) {
    return (
      <Portal>
        <Box pos="fixed" top={0} left={0} w="100vw" h="100vh" bg="dark.7">
          <ActionIcon pos="absolute" top="1rem" right="1rem" size="xl" color="gray" onClick={() => setFullScreen(false)}>
            <IconX />
          </ActionIcon>

          <Center w="100%" h="100%">
            <img src={`/api/image/full/${path.join(...props.path, props.name)}`} style={{ maxWidth: "100vw", maxHeight: "100vh" }} alt={props.name} />
          </Center>
        </Box>
      </Portal>
    );
  }

  if (mediaType === "image") {
    return (
      <Image
        width={200}
        height={200}
        src={`/api/image/preview/${path.join(...props.path, props.name)}`}
        loader={({ src }) => src}
        alt={props.name}
        style={{ borderRadius: "5px", cursor: "pointer" }}
        onClick={() => setFullScreen(true)}
      />
    );
  }

  if (mediaType === "video") {
    return (
      <Box pos="relative" w={200} h={200}>
        <Center pos="absolute" top={0} left={0} w="100%" h="100%">
          <IconVideo size="150px" color="white" />
        </Center>
      </Box>
    );
  }

  return (
    <Box pos="relative" w={200} h={200}>
      <Center pos="absolute" top={0} left={0} w="100%" h="100%">
        <IconQuestionMark size="150px" color="white" />
      </Center>
    </Box>
  );
};
