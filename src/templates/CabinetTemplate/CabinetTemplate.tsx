import { FC } from 'react';
import { Outlet } from 'react-router-dom';

import { routes } from '#data/routes';
import { Button } from '#ui/Button';
import { HStack } from '#ui/Stack';

export const CabinetTemplate: FC = () => (
  <HStack gap={32}>
    <Button to={routes.uploadBase}>Upload Version</Button>
    <div>
      <Outlet />
    </div>
  </HStack>
);
