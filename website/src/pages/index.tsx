import { Title } from "@mantine/core";
import Head from "next/head";
import React from "react";

const Page: React.FC<{}> = () => {
  return (
    <>
      <Head>
        <title>PhotoBox</title>
        <meta name="description" content="A web-based photo management app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div>
        <Title>Photobox</Title>
      </div>
    </>
  );
}

export default Page;
