import { Box, Center, Text, useMantineTheme } from "@mantine/core";
import { IconCameraOff } from "@tabler/icons-react";
import Image from "next/image";
import Link from "next/link";
import { join as joinPath } from "path";
import React from "react";

export type PreviewDirectory = {
  name: string;
  previews: string[];
};

type Props = {
  path: string[];
  directory: PreviewDirectory;
};

export const Component_Previews_Directory: React.FC<Props> = (props) => {
  const theme = useMantineTheme();
  const backgroundColor = theme.colorScheme === "dark" ? theme.colors.dark[7] : "white";

  return (
    <>
      <Box
        component={Link}
        href={`/photos/${joinPath(...props.path, props.directory.name)}`}
        pos="relative"
        w={200}
        h={200}
        sx={{ borderRadius: "5px", overflow: "hidden" }}
      >
        {props.directory.previews.length === 0 && (
          <Center pos="absolute" top={0} left={0} w="100%" h="100%" bg={backgroundColor}>
            <IconCameraOff size="150px" color="white" />
          </Center>
        )}

        {props.directory.previews.length === 1 && (
          <Image width={200} height={200} src={`/api/image/preview/${props.directory.previews[0]}`} unoptimized alt={props.directory.name} />
        )}

        {props.directory.previews.length >= 2 && (
          <>
            <Box pos="absolute" top={0} left={0}>
              <Image width={100} height={100} src={`/api/image/preview/${props.directory.previews[0]}`} unoptimized alt={props.directory.name} />
            </Box>
            <Box pos="absolute" top={0} left={100}>
              <Image width={100} height={100} src={`/api/image/preview/${props.directory.previews[1]}`} unoptimized alt={props.directory.name} />
            </Box>
            {props.directory.previews.length >= 3 && (
              <Box pos="absolute" top={100} left={0}>
                <Image width={100} height={100} src={`/api/image/preview/${props.directory.previews[2]}`} unoptimized alt={props.directory.name} />
              </Box>
            )}
            {props.directory.previews.length >= 4 && (
              <Box pos="absolute" top={100} left={100}>
                <Image width={100} height={100} src={`/api/image/preview/${props.directory.previews[3]}`} unoptimized alt={props.directory.name} />
              </Box>
            )}
          </>
        )}

        <Center pos="absolute" left={0} bottom={0} w="100%">
          <Text color="white" bg={backgroundColor} px="xs" truncate sx={{ borderTopLeftRadius: "5px", borderTopRightRadius: "5px" }}>
            {props.directory.name}
          </Text>
        </Center>
      </Box>
    </>
  );
};
