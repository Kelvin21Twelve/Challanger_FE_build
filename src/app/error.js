"use client";

import { Button, Typography } from "antd";

const { Title } = Typography;

export default function Page({ reset }) {
  return (
    <div>
      <div>
        <Title level={2}>Something went wrong!</Title>
      </div>
      <div>
        <Button type="primary" onClick={() => reset()}>
          Try again
        </Button>
      </div>
    </div>
  );
}
