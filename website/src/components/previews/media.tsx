import { Box, Center } from "@mantine/core";
import { IconQuestionMark, IconVideo } from "@tabler/icons-react";
import mime from "mime";
import NextImage from "next/image";
import path from "path";
import React, { useMemo, useState } from "react";
import { Component_Fullscreens_Image } from "../fullscreens/image";
import { Component_Fullscreens_Video } from "../fullscreens/video";
import { useDisclosure } from "@mantine/hooks";

type Props = {
  path: string[];
  name: string;
};

type SubProps = Props & {
  fullscreen: () => void;
};

export const Component_Previews_Media: React.FC<Props> = (props) => {
  const [fullScreen, setFullScreen] = useDisclosure(false);

  const mediaType = useMemo<"image" | "video" | null>(() => {
    let mimeType = mime.getType(props.name);

    if (mimeType && mimeType.startsWith("image/")) return "image";
    if (mimeType && mimeType.startsWith("video/")) return "video";
    return null;
  }, [props.name]);

  if (mediaType === "image") {
    return fullScreen ? <Component_Fullscreens_Image {...props} close={setFullScreen.close} /> : <Image {...props} fullscreen={setFullScreen.open} />;
  }

  if (mediaType === "video") {
    return fullScreen ? <Component_Fullscreens_Video {...props} close={setFullScreen.close} /> : <Video {...props} fullscreen={setFullScreen.open} />;
  }

  return (
    <Box pos="relative" w={200} h={200}>
      <Center pos="absolute" top={0} left={0} w="100%" h="100%">
        <IconQuestionMark size="150px" color="white" />
      </Center>
    </Box>
  );
};

const Image: React.FC<SubProps> = (props) => {
  return (
    <NextImage
      width={200}
      height={200}
      src={`/api/image/preview/${path.join(...props.path, props.name)}`}
      unoptimized
      alt={props.name}
      style={{ borderRadius: "5px", cursor: "pointer" }}
      onClick={props.fullscreen}
    />
  );
};

const Video: React.FC<SubProps> = (props) => {
  return (
    <Box pos="relative" w={200} h={200} style={{ borderRadius: "5px", cursor: "pointer" }} onClick={props.fullscreen}>
      <Center pos="absolute" top={0} left={0} w="100%" h="100%">
        <IconVideo size="150px" color="white" />
      </Center>
    </Box>
  );
};
