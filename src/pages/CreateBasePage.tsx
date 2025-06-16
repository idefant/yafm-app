import { zodResolver } from '@hookform/resolvers/zod';
import { FC } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import z from 'zod';

import { routes } from '#data/routes';
import { useAppDispatch, useAppSelector } from '#hooks/reduxHooks';
import Cryptor from '#modules/Cryptor';
import { unlockBase } from '#store/reducers/appSlice';
import { Button } from '#ui/Button';
import { Form } from '#ui/Form';
import { HStack } from '#ui/Stack';
import { Title } from '#ui/Typography';
import { initBase } from '#utils/baseFs';
import { actionCreator, committer } from '#utils/committer';

const formSchema = z.object({
  password: z.string().nonempty(),
});

type FormOutput = z.infer<typeof formSchema>;

const CreateBasePage: FC = () => {
  const { folderPath } = useAppSelector((state) => state.app);
  const dispatch = useAppDispatch();

  const navigate = useNavigate();

  const methods = useForm<FormOutput>({ resolver: zodResolver(formSchema) });
  const { handleSubmit } = methods;

  const onSubmit = async (values: FormOutput) => {
    if (!folderPath) return;

    await initBase(folderPath);
    await Cryptor.setSecret({ password: values.password });
    await committer(actionCreator.initBase()).sync();
    dispatch(unlockBase());

    navigate(routes.dashboard);
  };

  return (
    <div>
      <Title level={4}>Create Base</Title>

      <FormProvider {...methods}>
        <Form onSubmit={handleSubmit(onSubmit)}>
          <Form.Password name="password" label="New Password" autoFocus />

          <HStack justify="center">
            <Button type="submit">Create new Base</Button>
          </HStack>
        </Form>
      </FormProvider>
    </div>
  );
};

export default CreateBasePage;
