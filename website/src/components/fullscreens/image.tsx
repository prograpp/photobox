import { ajax } from "@/lib/ajax";
import { Api_Meta_Image_$Paths_Get_200 } from "@/pages/api/meta/image/[...paths]";
import { DatabaseMedia } from "@/types/database";
import { ActionIcon, Box, Center, Drawer, Group, Portal, Stack, Text } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { IconCalendar, IconCamera, IconClock, IconInfoCircle, IconMap, IconX } from "@tabler/icons-react";
import dayjs from "dayjs";
import dynamic from "next/dynamic";
import path from "path";
import React, { useEffect, useState } from "react";

const Map = dynamic(() => import("./single-map"), { ssr: false });

type Props = {
  path: string[];
  name: string;
  close: () => void;
};

export const Component_Fullscreens_Image: React.FC<Props> = (props) => {
  const [showMeta, setShowMeta] = useDisclosure(false);
  const [meta, setMeta] = useState<DatabaseMedia | null>(null);

  const loadMeta = (): void => {
    ajax.get(`/api/meta/image/${path.join(...props.path, props.name)}`).on(200, (res: Api_Meta_Image_$Paths_Get_200) => {
      setMeta(res);
    });
  };

  useEffect(loadMeta, [props.path, props.name]);

  return (
    <>
      {meta === null || (
        <Drawer opened={showMeta} onClose={setShowMeta.close} size="lg" position="left">
          <Stack>
            <Group position="left">
              <IconCalendar />
              <Text>{dayjs(meta.datetime).format("DD.MM.YYYY")}</Text>
            </Group>

            <Group position="left">
              <IconClock />
              <Text>{dayjs(meta.datetime).format("HH:mm:ss [Uhr]")}</Text>
            </Group>

            <Group position="left">
              <IconCamera />
              <Text>
                {meta.make} {meta.model}
              </Text>
            </Group>

            {meta.latitude === null || meta.longitude === null || (
              <Group position="left">
                <IconMap />
                <Box sx={{ flexGrow: 1 }}>
                  <Map latitude={meta.latitude ?? 0} longitude={meta.longitude ?? 0} />
                </Box>
              </Group>
            )}
          </Stack>
        </Drawer>
      )}

      <Portal>
        <Box pos="fixed" top={0} left={0} w="100vw" h="100vh" bg="dark.7">
          <ActionIcon pos="absolute" top="1rem" left="1rem" size="xl" color="gray" onClick={setShowMeta.open}>
            <IconInfoCircle />
          </ActionIcon>

          <ActionIcon pos="absolute" top="1rem" right="1rem" size="xl" color="gray" onClick={props.close}>
            <IconX />
          </ActionIcon>

          <Center w="100%" h="100%">
            <img src={`/api/image/full/${path.join(...props.path, props.name)}`} style={{ maxWidth: "100vw", maxHeight: "100vh" }} alt={props.name} />
          </Center>
        </Box>
      </Portal>
    </>
  );
};
