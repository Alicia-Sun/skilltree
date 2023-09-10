import { useState, ChangeEvent, useContext } from "react";
import {
  TextInput,
  PasswordInput,
  Checkbox,
  Anchor,
  Paper,
  Title,
  Text,
  Container,
  Group,
  Button,
} from "@mantine/core";
import { useMutation } from "react-query";

import { MantineTheme } from "@mantine/core";
import { API_URL } from "../constants";
import Link from "next/link";

export default function AuthenticationForm() {
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { isLoading, mutate } = useMutation(
    () =>
      fetch(`${API_URL}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ phone, password }),
        credentials: "include",
      }),
    {
      onSuccess: async (data) => {
        const d = await data.body?.getReader().read();
        const res = JSON.parse(new TextDecoder("utf-8").decode(d?.value));
        if (res.error) {
          setError(res.error);
        } else {
          window.location.href = "/app";
        }
      },
    }
  );

  const handleLogin = () => {
    mutate();
  };

  const handlePhoneChange = (event: ChangeEvent<HTMLInputElement>) => {
    setPhone(event.currentTarget.value);
  };

  const handlePasswordChange = (event: ChangeEvent<HTMLInputElement>) => {
    setPassword(event.currentTarget.value);
  };

  return (
    <Container size={420} my={40}>
      <Title
        align="center"
        sx={(theme: MantineTheme) => ({
          fontFamily: `Greycliff CF, ${theme.fontFamily}`,
          fontWeight: 900,
        })}
      >
        Welcome back!
      </Title>
      <Text color="dimmed" size="sm" align="center" mt={5}>
        Do not have an account yet?{" "}
        <Link href="/signup">
          <Anchor size="sm" component="button">
            Create account
          </Anchor>
        </Link>
      </Text>

      <Paper
        withBorder
        shadow="md"
        p={30}
        mt={30}
        radius="md"
        className="login-form"
      >
        <TextInput
          label="Phone"
          placeholder="4155161314"
          value={phone}
          onChange={handlePhoneChange}
          style={{ textAlign: "left" }}
          required
        />
        <PasswordInput
          label="Password"
          placeholder="Your Password"
          mt="md"
          value={password}
          onChange={handlePasswordChange}
          style={{ textAlign: "left" }}
          required
        />
        {/* @ts-ignore */}
        {error && <Text color="red">{error}</Text>}
        <Group position="apart" mt="lg">
          <Anchor component="button" size="sm">
            Forgot password?
          </Anchor>
        </Group>
        {/* <Button
          fullWidth
          bg="violet"
          mt="xl"
          onClick={handleLogin}
          loading={isLoading}
        >
          Sign in
        </Button>
        */}

        <Button
          mt="xl"
          onClick={handleLogin}
          loading={isLoading}
          variant="default"
          fullWidth
        >
          Login
        </Button>
      </Paper>
    </Container>
  );
}
