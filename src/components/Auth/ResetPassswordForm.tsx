import { useState } from 'react';
import { Link } from 'react-router-dom';
import { sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '../../../firebase/config';
import { Button, Label, TextInput, Spinner } from 'flowbite-react';
import { validateEmail } from '../../../utils/regex';

const ResetPasswordComponent: React.FC = () => {
  const [resetEmail, setResetEmail] = useState<string>('');
  const [sentEmail, setSentEmail] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handlePasswordReset = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');
    setIsLoading(true);

    //Checks if the email user entered is in a valid format (any domain)
    if (!validateEmail(resetEmail)) {
      setError('Please enter a valid email address.');
      setIsLoading(false);
      return;
    }
    //If validation passes send the reset password link to the user email inbox
    try {
      await sendPasswordResetEmail(auth, resetEmail);
      setSentEmail(true);
    } catch (err: any) {
      console.error('Password Reset Error:', err);
      setError('Failed to send reset email. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-screen w-full bg-login-back bg-cover bg-center">
      <div className="flex h-full w-full items-center justify-center backdrop-brightness-50">
        {sentEmail ? (
          <div className="w-full max-w-96 rounded-xl bg-black/50 p-5 md:w-1/2 md:max-w-xl">
            <h2 className="my-2 text-center text-xl uppercase text-white">Check Your Inbox</h2>
            <p className="text-center text-white">We've sent you a password reset email.</p>
            <Link
              to="/"
              className="mt-4 flex w-full justify-center rounded-lg bg-green-400 py-2 text-white hover:bg-green-600"
            >
              Back to Login
            </Link>
          </div>
        ) : (
          <form
            onSubmit={handlePasswordReset}
            className="w-full max-w-96 rounded-xl bg-black/50 p-5 md:w-1/2 md:max-w-xl"
          >
            <h2 className="my-2 text-center text-xl uppercase text-white">Reset Password</h2>
            <p className="mb-4 text-center text-white">
              Please enter your email to receive a reset link
            </p>

            <div className="mb-4">
              <Label htmlFor="email" className="text-white">
                E-mail
              </Label>
              <TextInput
                id="email"
                type="email"
                value={resetEmail}
                onChange={(e) => setResetEmail(e.target.value)}
                placeholder="user@example.com"
                shadow
              />
            </div>
            {/*Conditionaly render error messages */}
            {error && <p className="mt-2 text-center text-teal-400">{error}</p>}

            <div className="py-2 text-center text-white">
              <p>Don’t have an account?</p>
              <Link to="/sign-up" className="text-green-400 hover:text-green-600">
                Sign up here
              </Link>
            </div>

            <div className="py-2 text-center text-white">
              <Link to="/" className="text-green-400 hover:text-green-600">
                Back to Login
              </Link>
            </div>

            <Button
              type="submit"
              color="none"
              className="mt-2 w-full bg-green-400 text-white hover:bg-green-600"
            >
              {isLoading ? <Spinner color="success" /> : 'Reset Password'}
            </Button>
          </form>
        )}
      </div>
    </div>
  );
};

export default ResetPasswordComponent;
