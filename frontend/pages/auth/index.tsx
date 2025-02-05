import React, { useEffect, useState } from "react";
import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { auth } from "../../firebase/config";
import { useRouter } from "next/router";
import { Button, useColorMode, useToast } from "@chakra-ui/react";
import { AiFillGoogleCircle } from "react-icons/ai";
import { CREATEUSER } from "../../api";
import axios from "axios";
import Cookie from "js-cookie";
import Head from "next/head";

const Index = () => {
  // fall back based on auth state
  const { colorMode, toggleColorMode } = useColorMode();
  useEffect(() => {
    if (Cookie.get("jwtID")) {
      router.back();
    }
  }, [Cookie.get("jwtID")]);

  useEffect(() => {
    if (colorMode === "light") {
      setBg("bg-gradient-to-br from-pink-500 via-red-500 to-yellow-500");
    } else {
      setBg("bg-gradient-to-tl from-gray-700 via-gray-900 to-black");
    }
  }, [colorMode]);
  const [background, setBg] = useState<string>("bg-gradient-to-tl from-gray-700 via-gray-900 to-black");
  const toast = useToast();
  const router = useRouter();
  const [msg, setMsg] = useState<string>("Sign up Successfull");
  // Authentication Function
  const authFunc = () => {
    //fiebase login code
    const provider = new GoogleAuthProvider();
    const getAuth = async () => {
      try {
        const res = await signInWithPopup(auth, provider);
        const oauth = res.user;
        const query = {
          name: oauth.displayName,
          email: oauth.email,
          UID: oauth.uid,
          image: oauth.photoURL,
        };
        //sending post req return a boolean
        if (!res.user.emailVerified) throw new Error("Couldn't sign in");
        const { data } = await axios.post(CREATEUSER, query, {
          withCredentials: true,
        });
        if (!data.ok) throw new Error();
        if (data.message.startsWith("welcome")) {
          setMsg("You were logged in successfully");
        }
        toast({
          title: data.message,
          description: msg,
          status: "success",
          duration: 9000,
          isClosable: true,
        });
        router.replace("/");
      } catch (e) {
        // alert("could not sign in");
        toast({
          title: "Couldnt create account",
          description: "couldnt complete your request",
          status: "error",
          duration: 9000,
          isClosable: true,
        });
      }
    };
    getAuth();
  };

  return (
    <div className={`h-screen ${background}  flex justify-center items-center flex-col `}>
      <div className="h-[300px] bg-white flex justify-center items-center flex-col w-[350px] rounded-lg">
        <h1 className="font-bold text-[26px] text-black" onClick={toggleColorMode}>Login/Signup</h1>
        <Button
          colorScheme="red"
          className="flex justify-between mt-10"
          leftIcon={<AiFillGoogleCircle />}
          onClick={authFunc}
        >
          <h6>Sign Up With Google</h6>
        </Button>
      </div>
      <Head>
        <title>Auth</title>
        <meta name="description" content="user authorization" />
      </Head>
    </div>
  );
};

export default Index;
