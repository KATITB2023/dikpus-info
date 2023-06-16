import type { NextPage } from "next";
import type { FormEventHandler } from "react";
import { signIn } from "next-auth/react";
import { useState } from "react";



const SignIn: NextPage = () => {
    const [userInfo, setUserInfo] = useState({email: '', password: ""})
    const handleSubmit: FormEventHandler<HTMLFormElement> = (e) => {
        e.preventDefault();
        signIn('credentials', {
            email: userInfo.email,
            password: userInfo.password,
            redirect: false
        }).catch((error) => {
            // Handle error here
            console.log(error);
        });
        return;
    };
    return (
        <div className="sign-in-form">
            <form onSubmit = {handleSubmit}>
                <h1>Login</h1>
                <input
                    type="text"
                    placeholder="13520056"
                    value={userInfo.email}
                    onChange={({ target }) =>
                        setUserInfo({ ...userInfo, email: target.value})
                    }
                />
                <input
                    type="password"
                    placeholder="********"
                    value={userInfo.password}
                    onChange={({ target }) =>
                        setUserInfo({ ...userInfo, password: target.value})
                    }
                />
                <input type="submit" value="Login"/>
            </form>
        </div>
    );
};

export default SignIn