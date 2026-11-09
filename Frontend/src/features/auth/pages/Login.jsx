import { useState } from 'react'
import { Link } from 'react-router'
import { useNavigate } from 'react-router'
import { useAuth } from '../hooks/useAuth'

const Login = () => {
  const { handleLogin } = useAuth()
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  })
  const [showPassword, setShowPassword] = useState(false)

  const handleChange = ({ target }) => {
    setFormData((currentData) => ({
      ...currentData,
      [target.name]: target.value,
    }))
  }

const handleSubmit = async (event) => {
    event.preventDefault();

    const payload = {
        email: formData.email,
        password: formData.password,
    };

    try {
        await handleLogin(payload);
        navigate('/');
    } catch (error) {
        console.error('Login failed:', error);
    }
};

  return (
    <main className="flex min-h-screen items-center justify-center bg-[radial-gradient(circle_at_top_right,_rgba(8,145,178,0.22),_transparent_38%),radial-gradient(circle_at_bottom_left,_rgba(30,64,175,0.2),_transparent_42%),linear-gradient(135deg,_#020708_0%,_#06181b_52%,_#071329_100%)] px-4 py-8 text-[#E0E0E0] sm:px-6 sm:py-12">
      <section className="w-full max-w-md">
        <Link to="/" className="mb-12 block text-center text-2xl font-semibold tracking-[-0.04em] text-[#E0E0E0]">
          perplexity
        </Link>

        <div className="rounded-2xl border border-cyan-700/40 bg-black/30 p-6 shadow-2xl shadow-cyan-950/30 backdrop-blur-xl sm:p-10">
          <div className="mb-8 text-center">
            <h1 className="text-2xl font-semibold tracking-[-0.03em]">Welcome back</h1>
            <p className="mt-2 text-sm text-[#a6aaaa]">Sign in to continue your search.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="login-email" className="mb-2 block text-sm font-medium text-[#E0E0E0]">Email</label>
              <input
                id="login-email"
                name="email"
                type="email"
                autoComplete="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="you@example.com"
                required
                className="w-full rounded-lg border border-[#454949] bg-[#100E12] px-4 py-3 text-sm text-[#E0E0E0] outline-none transition placeholder:text-[#777d7d] focus:border-[#1FB8CD] focus:ring-2 focus:ring-[#1FB8CD]/20"
              />
            </div>

            <div>
              <div className="mb-2 flex items-center justify-between">
                <label htmlFor="login-password" className="block text-sm font-medium text-[#E0E0E0]">Password</label>
                <button type="button" className="text-xs font-medium text-[#1FB8CD] hover:text-[#32B8C6]">Forgot password?</button>
              </div>
              <div className="relative">
                <input
                  id="login-password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  required
                  className="w-full rounded-lg border border-[#454949] bg-[#100E12] px-4 py-3 pr-12 text-sm text-[#E0E0E0] outline-none transition placeholder:text-[#777d7d] focus:border-[#1FB8CD] focus:ring-2 focus:ring-[#1FB8CD]/20"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((visible) => !visible)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  aria-pressed={showPassword}
                  className="absolute inset-y-0 right-0 flex items-center px-4 text-[#a6aaaa] hover:text-[#E0E0E0] focus:outline-none focus:text-[#1FB8CD]"
                >
                  <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-5 w-5">
                    {showPassword ? (
                      <>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 3l18 18M10.6 10.6a2 2 0 002.8 2.8" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9.9 5.2A10.8 10.8 0 0112 5c5 0 8.5 4.5 9.5 7-.4 1-1.2 2.2-2.3 3.3M6.2 6.2C3.9 7.6 2.7 9.8 2.5 12c.5 1.3 1.5 2.8 3.3 4.1A10.4 10.4 0 0012 19c1 0 2-.2 2.9-.5" />
                      </>
                    ) : (
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.5 12S6 5 12 5s9.5 7 9.5 7-3.5 7-9.5 7-9.5-7-9.5-7z" />
                    )}
                    {!showPassword && <circle cx="12" cy="12" r="2.5" />}
                  </svg>
                </button>
              </div>
            </div>

            <button type="submit" className="w-full rounded-lg bg-[#32B8C6] px-4 py-3 text-sm font-semibold text-[#100E12] transition hover:bg-[#1FB8CD] focus:outline-none focus:ring-2 focus:ring-[#1FB8CD]/40 focus:ring-offset-2 focus:ring-offset-[#1F2121]">
              Sign in
            </button>
          </form>

          <p className="mt-8 text-center text-sm text-[#a6aaaa]">
            Don&apos;t have an account?{' '}
            <Link to="/register" className="font-medium text-[#1FB8CD] hover:text-[#32B8C6]">Create one</Link>
          </p>
        </div>
      </section>
    </main>
  )
}

export default Login
