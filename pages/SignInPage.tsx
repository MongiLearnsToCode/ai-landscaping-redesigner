import { useSupabaseClient } from '@supabase/auth-helpers-react';
import { Auth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';

const SignInPage = () => {
  const supabaseClient = useSupabaseClient();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full p-8 space-y-8 bg-white rounded-lg shadow-md">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-gray-900">Sign In</h2>
          <p className="mt-2 text-sm text-gray-600">
            Access your account and design history
          </p>
        </div>
        <Auth
          supabaseClient={supabaseClient}
          appearance={{ theme: ThemeSupa }}
          providers={['google', 'github']}
          theme="dark"
        />
      </div>
    </div>
  );
};

export default SignInPage;
