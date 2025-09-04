import { GoogleLogin, useGoogleOneTapLogin } from '@react-oauth/google';
import { useNavigate } from 'react-router-dom';
import {API_BASE_URL} from '../config/serverApiConfig';

function LoginWithGoogle() {
  const navigate = useNavigate();

  const handleGoogleSuccess = async (res) => {
    const response = await fetch(`${API_BASE_URL}google-login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token: res.credential }),
    });

    const data = await response.json();
    if (data.success === true) {
      localStorage.setItem('token', data.result.token);
      alert(data.message);
      navigate('/dashboard');
    } else {
      alert('Login failed!');
    }
  };

  // ✅ One Tap Login
  useGoogleOneTapLogin({
    onSuccess: handleGoogleSuccess,
    onError: () => console.log('One Tap Failed'),
    use_fedcm_for_prompt: true,
  });

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500">
      <div className="bg-white/90 backdrop-blur-md shadow-2xl rounded-2xl p-10 w-full max-w-md text-center">
        <h1 className="text-2xl font-bold text-gray-800 mb-3">Welcome Back 👋</h1>
        <p className="text-gray-600 mb-6">Sign in with your Google account to continue</p>

        <div className="flex justify-center">
          <GoogleLogin
            onSuccess={handleGoogleSuccess}
            onError={() => console.log('Button Login Failed')}
            size="large"
            shape="pill"
            theme="outline"
            text="signin_with"
          />
        </div>

        <div className="mt-6">
          <p className="text-sm text-gray-500">
            By logging in, you agree to our{' '}
            <a href="/terms" className="text-indigo-600 hover:underline">
              Terms of Service
            </a>{' '}
            &{' '}
            <a href="/privacy" className="text-indigo-600 hover:underline">
              Privacy Policy
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}

export default LoginWithGoogle;
