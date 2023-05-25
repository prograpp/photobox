import { ActionIcon, Box, Divider, Stack, Tooltip } from "@mantine/core";
import { IconAlbum, IconMap2, IconPhoto, IconSettings, IconUsers } from "@tabler/icons-react";
import Link from "next/link";
import React from "react";

type NavigationItem =
  | {
      icon: React.ReactNode;
      href: string;
      label?: string;
    }
  | "divider";

export const Component_Nav: React.FC<{}> = () => {
  const navigation: NavigationItem[] = [
    {
      icon: <IconPhoto size="2.125rem" />,
      href: "/photos",
      label: "Photos",
    },
    {
      icon: <IconAlbum size="2.125rem" />,
      href: "/albums",
      label: "Albums",
    },
    {
      icon: <IconUsers size="2.125rem" />,
      href: "/persons",
      label: "Persons",
    },
    {
      icon: <IconMap2 size="2.125rem" />,
      href: "/locations",
      label: "Locations",
    },
    "divider",
    {
      icon: <IconSettings size="2.125rem" />,
      href: "/settings",
      label: "Settings",
    },
  ];

  return (
    <Box sx={{ height: "calc(100vh - 16px)" }}>
      <Stack>
        {navigation.map((item, index) => (
          <NavigationItem key={index} item={item} />
        ))}
      </Stack>
    </Box>
  );
};

const NavigationItem: React.FC<{ item: NavigationItem }> = ({ item }) => {
  if (item === "divider") {
    return <Divider />;
  }

  const button = (
    <ActionIcon size="xl" component={Link} href={item.href}>
      {item.icon}
    </ActionIcon>
  );

  return item.label ? (
    <Tooltip label={item.label} position="right">
      {button}
    </Tooltip>
  ) : (
    button
  );
};
