import { Button, Label, TextInput } from 'flowbite-react';
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { signInWithEmailAndPassword, setPersistence, browserLocalPersistence } from 'firebase/auth';
import { auth } from '../../../firebase/config';
import { validateEmail, validatePassword } from '../../../utils/regex';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');

    //Checks if the email user entered is in a valid format (any domain)
    if (!validateEmail(email)) {
      setError('Please enter a valid email address.');
      return;
    }
    //Checks if the password user entered is in a valid format
    if (!validatePassword(password)) {
      setError(
        'Password must be at least 8 characters, with one uppercase letter, one number, and one special character.'
      );
      return;
    }
    //If the validation passed continue with the Login with Firebase Auth
    try {
      //Seting the browser persistance and signin in with using Firebase Auth
      await setPersistence(auth, browserLocalPersistence);
      const res = await signInWithEmailAndPassword(auth, email, password);

      //Setting the token from response in local storage
      const token = await res.user.getIdToken();
      localStorage.setItem('token', token);

      //When the user has logged in navigate them the the Characters route
      navigate('/characters');
    } catch (err: any) {
      console.error(err.message);
      setError('Login failed. Please try again.');
    }
  };

  return (
    <div className="h-screen w-full bg-login-back bg-cover bg-center">
      <div className="flex h-full w-full items-center justify-center backdrop-brightness-50">
        <form
          onSubmit={handleLogin}
          className="w-full max-w-96 rounded-xl bg-black/50 p-5 md:w-1/2 md:max-w-xl"
        >
          <h2 className="my-2 text-center text-xl uppercase text-white">Login</h2>
          <p className="mb-4 text-center text-white">Please login to continue</p>

          <div className="mb-4">
            <Label htmlFor="email" className="text-white">
              E-mail
            </Label>
            <TextInput
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="user@example.com"
              shadow
            />
          </div>

          <div className="mb-4">
            <Label htmlFor="password" className="text-white">
              Password
            </Label>
            <TextInput
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              shadow
            />
          </div>
          {/*Conditionaly render error messages */}
          {error && <p className="mt-2 text-center text-teal-400">{error}</p>}

          <div className="py-2 text-center text-white">
            <p>Forgot your password?</p>
            <Link to="/reset-password" className="text-green-400 hover:text-green-600">
              Reset Password
            </Link>
          </div>

          <Button type="submit" className="mt-2 w-full bg-green-400 text-white hover:bg-green-600">
            Login
          </Button>

          <p className="mt-4 text-center text-white">Don't have an account?</p>
          <Link
            to="/sign-up"
            className="mt-2 flex w-full justify-center rounded-lg bg-green-400 py-2 text-white hover:bg-green-600"
          >
            Sign Up
          </Link>
        </form>
      </div>
    </div>
  );
}
