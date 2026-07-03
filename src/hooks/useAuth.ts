import { useMutation } from '@tanstack/react-query';
import { api } from "../lib/axios";
import { useRouter } from 'next/navigation';

//login korar jonno 

export const useLogin = () =>{
    const router = useRouter();

    return useMutation({
        mutationFn: async(loginData:Record<string,string>)=>{
            const res= await api.post('/auth/login', loginData);
      return res.data;
        },
        onSuccess:(data) =>{
            alert('Login successful');

            // user role condition 
            if(data.user?.role === 'ADMIN'){
                router.push('/admin');
            }
            if(data.user?.role === 'SELLER'){
                router.push('/seller/dashboard');

            }
            else {
                router.push('/');
            }
        },
        onError:() =>{
            alert('Login failed');
        }
    })
}


// register korar jonno

export const useRegister = () =>{
    const router = useRouter();

    return useMutation({
        mutationFn:async(registerData:Record<string,string>)=>{
            const res = await api.post('/auth/register', registerData);
            return res.data;
        },
    onSuccess:() =>{
            alert('Registration successful');
            router.push('/login');
        },
        onError:() =>{
            alert('Registration failed');
        }
    })
}
