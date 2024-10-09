
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { toast } from "@/components/hooks/use-toast"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"

import axios from "axios"
import { useState } from "react"
import { useNavigate } from "react-router-dom"


const Auth = () => {

  const [isLogIn , setIsLogIn]  = useState(true)

  const SignUpSchema = z.object({
    userName: z
      .string()
      .min(2, { message: "Username must be at least 2 characters." })
      .max(20, { message: "Username should be less than 20 characters." })
      .toLowerCase()
      .trim(),
    channelName: z
      .string()
      .min(2, { message: "Channel name must be at least 2 characters." })
      .max(20, { message: "Channel name should be less than 20 characters." })
      .toLowerCase()
      .trim(),
    emailId: z
      .string()
      .email({ message: "Invalid email format." })
      .min(2, { message: "Email must be at least 2 characters." })
      .max(100, { message: "Email should be less than 100 characters." })
      .toLowerCase()
      .trim(),
    password: z
      .string()
      .regex(/^(?=.*[a-z])(?=.*[A-Z]).{9,}$/, {
        message:
          "Password must contain at least 1 lowercase, 1 uppercase letter and be 9+ characters long.",
      })
      .trim(),
  })


  const LoginSchema = z.object({
    emailId: z
      .string()
      .email({ message: "Invalid email format." })
      .min(2, { message: "Email must be at least 2 characters." })
      .max(100, { message: "Email should be less than 100 characters." })
      .toLowerCase()
      .trim(),
    password: z
      .string()
      .regex(/^(?=.*[a-z])(?=.*[A-Z]).{9,}$/, {
        message:
          "Password must contain at least 1 lowercase, 1 uppercase letter and be 9+ characters long.",
      })
      .trim(),
  })


  const formSchema = isLogIn ? LoginSchema : SignUpSchema

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      userName: "",
      channelName: "",
      emailId: "",
      password: "",
    },
  })

        const navigate = useNavigate();
 async function onSubmit(data) {
 
  let response;
    try {
      if (!isLogIn) {
         response = await axios.post('http://localhost:8080/user/signup', {
          userName: data.userName,
          channelName: data.channelName,
          emailId: data.emailId,
          password: data.password,
        }, {withCredentials:true});
      }else {
        response = await axios.post('http://localhost:8080/user/login', {
          emailId: data.emailId,
          password: data.password,
        }, {withCredentials:true});
      }

      if (response.status == 200) {
        navigate('/feed', {replace : true});
      }
    } catch (error) {
      console.error('Error submitting form:', error.response?.data || error.message);
    }

  }


    return (
        <div className=" flex m-auto mt-5 py-7 px-3  w-8/12 xl:w-3/12 justify-center items-center border-2 dark:text-white"> 
        
        <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="w-2/3 space-y-6">
         
        { !isLogIn ? ( <> 
             <FormField
              control={form.control}
              name="userName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>User name : </FormLabel>
                  <FormControl>
                    <Input type="text" placeholder="Enter your username" {...field}  />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} /><FormField
                control={form.control}
                name="channelName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Channel name : </FormLabel>
                    <FormControl>
                      <Input type="text" placeholder="Enter your channel name" {...field} />
                    </FormControl>
                  
                    <FormMessage />
                  </FormItem>
                )} /> 
                </>
           ) : null }

          <FormField
            control={form.control}
            name="emailId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email : </FormLabel>
                <FormControl>
                  <Input type="email" placeholder="Enter your email" {...field} />
                </FormControl>
               
                <FormMessage />
              </FormItem>
            )}
          />


          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password : </FormLabel>
                <FormControl>
                  <Input type="password" placeholder="Enter your password" {...field} />
                </FormControl>
               
                <FormMessage />
              </FormItem>
            )}
          />
          
          <Button type="submit"> {!isLogIn ? "Signup" : "Login"} </Button>
       
          <p  className="lg:text-lg">{!isLogIn ? "Already a User ?" : "Not registered ? "} <span onClick={() => setIsLogIn(!isLogIn)} className="text-blue-600" > {!isLogIn ? "Login now" : "Register Now"} </span> </p>
        </form>

      </Form>


      </div>
    )

}
export default Auth;





