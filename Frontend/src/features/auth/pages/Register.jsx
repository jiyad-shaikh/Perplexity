import { useState } from 'react'
import { Link } from 'react-router'

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const handleChange = ({ target }) => {
    setFormData((currentData) => ({
      ...currentData,
      [target.name]: target.value,
    }))
  }

  const handleSubmit = (event) => {
    event.preventDefault()
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#100E12] px-6 py-12 text-[#E0E0E0]">
      <section className="w-full max-w-md">
        <Link to="/" className="mb-12 block text-center text-2xl font-semibold tracking-[-0.04em] text-[#E0E0E0]">
          perplexity
        </Link>

        <div className="rounded-2xl border border-[#353838] bg-[#1F2121] p-8 shadow-[0_12px_40px_rgba(0,0,0,0.28)] sm:p-10">
          <div className="mb-8 text-center">
            <h1 className="text-2xl font-semibold tracking-[-0.03em]">Create your account</h1>
            <p className="mt-2 text-sm text-[#a6aaaa]">Start exploring better answers.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="register-name" className="mb-2 block text-sm font-medium text-[#E0E0E0]">Name</label>
              <input
                id="register-name"
                name="name"
                type="text"
                autoComplete="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Your name"
                required
                className="w-full rounded-lg border border-[#454949] bg-[#100E12] px-4 py-3 text-sm text-[#E0E0E0] outline-none transition placeholder:text-[#777d7d] focus:border-[#1FB8CD] focus:ring-2 focus:ring-[#1FB8CD]/20"
              />
            </div>

            <div>
              <label htmlFor="register-email" className="mb-2 block text-sm font-medium text-[#E0E0E0]">Email</label>
              <input
                id="register-email"
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
              <label htmlFor="register-password" className="mb-2 block text-sm font-medium text-[#E0E0E0]">Password</label>
              <div className="relative">
                <input
                  id="register-password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Create a password"
                  minLength="8"
                  required
                  className="w-full rounded-lg border border-[#454949] bg-[#100E12] px-4 py-3 pr-12 text-sm text-[#E0E0E0] outline-none transition placeholder:text-[#777d7d] focus:border-[#1FB8CD] focus:ring-2 focus:ring-[#1FB8CD]/20"
                />
                <button type="button" onClick={() => setShowPassword((visible) => !visible)} aria-label={showPassword ? 'Hide password' : 'Show password'} aria-pressed={showPassword} className="absolute inset-y-0 right-0 flex items-center px-4 text-[#a6aaaa] hover:text-[#E0E0E0] focus:outline-none focus:text-[#1FB8CD]">
                  <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-5 w-5">
                    {showPassword ? <><path strokeLinecap="round" strokeLinejoin="round" d="M3 3l18 18M10.6 10.6a2 2 0 002.8 2.8" /><path strokeLinecap="round" strokeLinejoin="round" d="M9.9 5.2A10.8 10.8 0 0112 5c5 0 8.5 4.5 9.5 7-.4 1-1.2 2.2-2.3 3.3M6.2 6.2C3.9 7.6 2.7 9.8 2.5 12c.5 1.3 1.5 2.8 3.3 4.1A10.4 10.4 0 0012 19c1 0 2-.2 2.9-.5" /></> : <><path strokeLinecap="round" strokeLinejoin="round" d="M2.5 12S6 5 12 5s9.5 7 9.5 7-3.5 7-9.5 7-9.5-7-9.5-7z" /><circle cx="12" cy="12" r="2.5" /></>}
                  </svg>
                </button>
              </div>
            </div>

            <div>
              <label htmlFor="register-confirm-password" className="mb-2 block text-sm font-medium text-[#E0E0E0]">Confirm password</label>
              <div className="relative">
                <input
                  id="register-confirm-password"
                  name="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Repeat your password"
                  minLength="8"
                  required
                  className="w-full rounded-lg border border-[#454949] bg-[#100E12] px-4 py-3 pr-12 text-sm text-[#E0E0E0] outline-none transition placeholder:text-[#777d7d] focus:border-[#1FB8CD] focus:ring-2 focus:ring-[#1FB8CD]/20"
                />
                <button type="button" onClick={() => setShowConfirmPassword((visible) => !visible)} aria-label={showConfirmPassword ? 'Hide password' : 'Show password'} aria-pressed={showConfirmPassword} className="absolute inset-y-0 right-0 flex items-center px-4 text-[#a6aaaa] hover:text-[#E0E0E0] focus:outline-none focus:text-[#1FB8CD]">
                  <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-5 w-5">
                    {showConfirmPassword ? <><path strokeLinecap="round" strokeLinejoin="round" d="M3 3l18 18M10.6 10.6a2 2 0 002.8 2.8" /><path strokeLinecap="round" strokeLinejoin="round" d="M9.9 5.2A10.8 10.8 0 0112 5c5 0 8.5 4.5 9.5 7-.4 1-1.2 2.2-2.3 3.3M6.2 6.2C3.9 7.6 2.7 9.8 2.5 12c.5 1.3 1.5 2.8 3.3 4.1A10.4 10.4 0 0012 19c1 0 2-.2 2.9-.5" /></> : <><path strokeLinecap="round" strokeLinejoin="round" d="M2.5 12S6 5 12 5s9.5 7 9.5 7-3.5 7-9.5 7-9.5-7-9.5-7z" /><circle cx="12" cy="12" r="2.5" /></>}
                  </svg>
                </button>
              </div>
            </div>

            <button type="submit" className="w-full rounded-lg bg-[#32B8C6] px-4 py-3 text-sm font-semibold text-[#100E12] transition hover:bg-[#1FB8CD] focus:outline-none focus:ring-2 focus:ring-[#1FB8CD]/40 focus:ring-offset-2 focus:ring-offset-[#1F2121]">
              Create account
            </button>
          </form>

          <p className="mt-8 text-center text-sm text-[#a6aaaa]">
            Already have an account?{' '}
            <Link to="/login" className="font-medium text-[#1FB8CD] hover:text-[#32B8C6]">Sign in</Link>
          </p>
        </div>
      </section>
    </main>
  )
}

export default Register
