import { API_URL } from "@/constants";
import {
  Anchor,
  Container,
  MantineTheme,
  Title,
  Text,
  Paper,
  TextInput,
  PasswordInput,
  Button,
} from "@mantine/core";
import Link from "next/link";
import { ChangeEvent, useState } from "react";
import { useMutation } from "react-query";

export default function SignupForm() {
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  // @ts-ignore
  //const { setIsLoggedIn } = useContext(LoginContext);
  const { isLoading, mutate } = useMutation(
    () =>
      fetch(`${API_URL}/signup`, {
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
          //setIsLoggedIn(true);
          window.location.href = "/";
        }
      },
    }
  );

  const handleSubmit = () => {
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
        Already have an account?{" "}
        <Link href="/login">
          <Anchor size="sm" component="button">
            Login
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
          required
          value={phone}
          onChange={handlePhoneChange}
          style={{ textAlign: "left" }}
        />
        <PasswordInput
          label="Password"
          placeholder="Your password"
          required
          mt="md"
          value={password}
          onChange={handlePasswordChange}
          style={{ textAlign: "left" }}
        />
        {error && <Text color="red">{error}</Text>}
        <Button
          fullWidth
          mt="xl"
          onClick={handleSubmit}
          loading={isLoading}
          variant="default"
        >
          Sign Up
        </Button>
      </Paper>
    </Container>
  );
}
