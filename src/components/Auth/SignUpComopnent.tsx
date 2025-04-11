import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button, Label, TextInput, Spinner } from 'flowbite-react';
import { createUserWithEmailAndPassword, sendEmailVerification } from 'firebase/auth';
import { auth } from '../../../firebase/config';
import { validateEmail, validatePassword } from '../../../utils/regex';

const SignUpComponent: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [formError, setFormError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [verificationSent, setVerificationSent] = useState(false);

  const handleSignUp = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFormError('');
    setEmailError('');
    setIsLoading(true);

    //Checks if the email user entered is in a valid format (any domain)
    if (!validateEmail(email)) {
      setFormError('Please enter a valid email address.');
      setIsLoading(false);
      return;
    }
    //Checks if the password user entered is in a valid format
    if (!validatePassword(password)) {
      setFormError(
        'Password must be at least 8 characters, contain one uppercase letter, one number, and one special character.'
      );
      setIsLoading(false);
      return;
    }
    //If validation passes continue with the sign up and send them a verification email
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);

      await sendEmailVerification(userCredential.user);
      setVerificationSent(true);
    } catch (err: any) {
      if (err.code === 'auth/email-already-in-use') {
        setEmailError('This email is already in use.');
      } else {
        setEmailError('An error occurred during sign up. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-screen w-full bg-login-back bg-cover bg-center">
      <div className="flex h-full w-full items-center justify-center backdrop-brightness-50">
        {verificationSent ? (
          <div className="w-full max-w-96 rounded-xl bg-black/50 p-5 md:w-1/2 md:max-w-xl">
            <h2 className="my-2 text-center text-xl uppercase text-white">
              Please Check Your Email
            </h2>
            <p className="text-center text-white">A verification link has been sent.</p>
            <Link
              to="/"
              className="mt-4 flex w-full justify-center rounded-lg bg-green-400 py-2 text-white hover:bg-green-600"
            >
              Back to Login
            </Link>
          </div>
        ) : (
          <form
            onSubmit={handleSignUp}
            className="w-full max-w-96 rounded-xl bg-black/50 p-5 md:w-1/2 md:max-w-xl"
          >
            <h2 className="my-2 text-center text-xl uppercase text-white">Sign Up</h2>
            <p className="mb-4 text-center text-white">Please register to continue</p>

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
            {emailError && <p className="mt-2 text-center text-teal-400">{emailError}</p>}
            {formError && <p className="mt-2 text-center text-teal-400">{formError}</p>}

            <div className="py-2 text-center text-white">
              <p>Already have an account?</p>
              <Link to="/" className="text-green-400 hover:text-green-600">
                Go to Login
              </Link>
            </div>

            <Button
              type="submit"
              color="none"
              className="mt-2 w-full bg-green-400 text-white hover:bg-green-600"
            >
              {isLoading ? <Spinner color="success" /> : 'Sign Up'}
            </Button>
          </form>
        )}
      </div>
    </div>
  );
};

export default SignUpComponent;
