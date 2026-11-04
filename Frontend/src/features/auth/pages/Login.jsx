import { useState } from 'react'
import { Link } from 'react-router'

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  })

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
              <input
                id="login-password"
                name="password"
                type="password"
                autoComplete="current-password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter your password"
                required
                className="w-full rounded-lg border border-[#454949] bg-[#100E12] px-4 py-3 text-sm text-[#E0E0E0] outline-none transition placeholder:text-[#777d7d] focus:border-[#1FB8CD] focus:ring-2 focus:ring-[#1FB8CD]/20"
              />
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
