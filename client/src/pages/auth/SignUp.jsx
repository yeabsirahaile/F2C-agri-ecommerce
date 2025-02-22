import { useDisclosure } from "@mantine/hooks";
import { useState } from "react";
import {
  Modal,
  Group,
  Button,
  Text,
  Select,
  ColorSchemeProvider,
  Stepper,
} from "@mantine/core";
import { useNavigate } from "react-router-dom";

import { useForm, matchesField, hasLength, isEmail } from "@mantine/form";
import { TextInput, PasswordInput, Box, Radio } from "@mantine/core";
import axiosConfig from "../../axiosConfig";
import { toast } from "react-toastify";
import axios from "axios";
import { login } from "../../features/userSlice";
import { Form, Input, LoadingOverlay } from "@mantine/core";
import Login from "./Loginn";
import { useDispatch } from "react-redux";
// import { Input } from '@mantine/core';
import { useId } from "@mantine/hooks";
import { IMaskInput } from "react-imask";

const region = [
  { value: "Amhara", label: "Amhara" },
  { value: "Afar", label: "Afar" },
  { value: "Benishangul-Gumuz", label: "Benishangul-Gumuz" },
  { value: "Dire Dawa", label: "Dire Dawa" },
  { value: "Gambela", label: "Gambela" },
  { value: "Harari", label: "Harari" },
  { value: "Oromia", label: "Oromia" },
  { value: "Sidama", label: "Sidama" },
  { value: "Somali", label: "Somali" },
  { value: "SNNP", label: "SNNP" },
  { value: "Tigray", label: "Tigray" },
];

const role = [
  { value: "Farmer", label: "Farmer" },
  { value: "Consumer", label: "Consumer" },
  { value: "Admin", label: "Admin" },
  { value: "CustomerSupport", label: "CustomerSupport" },
  { value: "Transporter", label: "Transporter" },
];

function SignUp({ onClose }) {
  const dispatch = useDispatch();
  const handleSubmit = async (formData) => {
    try {
      await axiosConfig.post("/auth/register", formData);
      const { data } = await axiosConfig.post("/auth/login", {
        email: formData.email,
        password: formData.password,
      });
      dispatch(login(data));
      onClose(); // Close the sign up modal
      toast.success("User registered successfully and logged in", {
        toastId: "register-success",
      });
    } catch (error) {
      toast.error(error?.response?.data?.msg || "Something went wrong", {
        toastId: "register-error",
      });
    }
  };
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();
  const [opened, { open, close }] = useDisclosure(true, {
    onOpen: () => {
      console.log("Opened");
    },
    onClose: () => {
      console.log("Closed");
    },
  });

  const form = useForm({
    // validate: zodResolver(schema),
    initialValues: {
      firstName: "",
      lastName: "",
      email: "",
      gender: "",
      password: "",
      passwordConfirm: "",
      region: "",
      address: "",
      role: "Consumer",
      phone: "",
    },
    validate: {
      firstName: hasLength({ min: 2 }, "Name must have 6 or more characters"),
      email: isEmail("Invalid email"),
      password: hasLength(
        { min: 6 },
        "password must have 6 or more characters"
      ),
      confirmPassword: matchesField("password", "Passwords are not the same"),
    },
  });
  // const value = form.values;
  // console.log(value);

  const [selectedRegion, setSelectedRegion] = useState(null);
  const [selectedRole, setSelectedRole] = useState(null);

  function handleRegionChange(value) {
    setSelectedRegion(value);
  }
  function handleRoleChange(value) {
    setSelectedRole(value);
  }

  const [showLogIn, setShowLogIn] = useState(false);
  const handleLogInClick = () => {
    close(); // Close the entire modal
    setShowLogIn(true); // Open the sign-up modal
  };
  // console.log(form.values);
  const [active, setActive] = useState(0);
  const nextStep = () =>
    setActive((current) => (current < 3 ? current + 1 : current));
  const prevStep = () =>
    setActive((current) => (current > 0 ? current - 1 : current));

  const id = useId();
  return (
    <Modal opened={opened} onClose={onClose} centered c="#8ce99a" my="0" py="0">
      <LoadingOverlay visible={isLoading} />
      <div c="blue.6" ta="center">
        <h2
          style={{
            color: "red",
            padding: 0,
            margin: 0,
            alignItems: "center",
            display: "flex",
            justifyContent: "center",
          }}
        >
          Create New Account
        </h2>{" "}
      </div>
      <Box size={32} maw={340} mx="auto" position="absolute" left="90">
        <form onSubmit={form.onSubmit((values) => handleSubmit(values))}>
          <>
            <Stepper
              size="sm"
              active={active}
              onStepClick={setActive}
              breakpoint="sm"
            >
              <Stepper.Step label="First step" description="Create an account">
                <TextInput
                  data-autpfocus
                  variant="filled"
                  withAsterisk
                  label="First Name"
                  placeholder="Yeabsra"
                  {...form.getInputProps("firstName")}
                />

                <TextInput
                  data-autpfocus
                  variant="filled"
                  withAsterisk
                  label="Last Name"
                  placeholder="Haile"
                  {...form.getInputProps("lastName")}
                />
                <Radio.Group
                  name="Gender"
                  label="gender"
                  withAsterisk
                  {...form.getInputProps("gender")}
                >
                  <Group mt="xxs">
                    <Radio value="male" label="Male" />
                    <Radio value="female" label="Female" />
                  </Group>
                </Radio.Group>

                <Select
                  data={region}
                  label="Select Region"
                  placeholder="Select region"
                  value={selectedRegion}
                  onChange={(value) => handleRegionChange(value)}
                  {...form.getInputProps("region")}
                />
                <TextInput
                  data-autpfocus
                  variant="filled"
                  withAsterisk
                  label="Address"
                  placeholder="gayint/debretabor"
                  {...form.getInputProps("address")}
                />
              </Stepper.Step>
              <Stepper.Step label="Second step" description="Verify email">
                <Input.Wrapper id={id} required maw={340} mx="auto">
                  <TextInput
                    component={IMaskInput}
                    mask="+251 000000000"
                    id={id}
                    data-autpfocus
                    variant="filled"
                    label="Phone Number"
                    {...form.getInputProps("phone")}
                  />
                </Input.Wrapper>

                <TextInput
                  data-autpfocus
                  variant="filled"
                  withAsterisk
                  label="Email"
                  placeholder="example@mail.com"
                  {...form.getInputProps("email")}
                />
                <PasswordInput
                  withAsterisk
                  variant="filled"
                  label="Password"
                  placeholder="pass123"
                  mt="sm"
                  {...form.getInputProps("password")}
                />
                <PasswordInput
                  withAsterisk
                  variant="filled"
                  label="Confirm Password"
                  placeholder=""
                  mt="sm"
                  {...form.getInputProps("confirmPassword")}
                />
                {/* <Select
                  data={role}
                  label="Select Role"
                  placeholder="Select role"
                  value={selectedRole}
                  onChange={(value) => handleRoleChange(value)}
                  {...form.getInputProps("role")}
                /> */}
              </Stepper.Step>
            </Stepper>

            <Group position="center" mt="xl">
              <Button variant="default" onClick={prevStep}>
                Back
              </Button>
              {active < 1 ? (
                <Button onClick={nextStep}>Next step</Button>
              ) : (
                <Group position="right" mt="xl">
                  <Button
                    variant="outline"
                    color="Green"
                    size="md"
                    type="submit"
                    // onClick={handleSubmit}
                  >
                    Sign Up
                  </Button>
                </Group>
              )}
            </Group>
          </>
        </form>
      </Box>
      <p className="loginForm__footer" style={{ gridColumn: "span 12" }}>
        Don't have an account?{" "}
        <button onClick={handleLogInClick} type="button">
          Sign up
        </button>
      </p>
      {showLogIn && <Login onClose={() => setShowLogIn(false)} />}{" "}
    </Modal>
  );

  //   <p className="loginForm__footer" style={{ gridColumn: "span 12" }}>
  //     Don't have an account?{" "}
  //     <button onClick={handleLogInClick} type="button">
  //       Sign up
  //     </button>
  //   </p>

  // {showLogIn && <Login onClose={() => setShowLogIn(false)} />}{" "}
  // {/* use navigate -1 */}
}

// ----------------------------------

export default SignUp;
