import { useState } from 'react'
import { Link } from 'react-router'

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
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
              <input
                id="register-password"
                name="password"
                type="password"
                autoComplete="new-password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Create a password"
                minLength="8"
                required
                className="w-full rounded-lg border border-[#454949] bg-[#100E12] px-4 py-3 text-sm text-[#E0E0E0] outline-none transition placeholder:text-[#777d7d] focus:border-[#1FB8CD] focus:ring-2 focus:ring-[#1FB8CD]/20"
              />
            </div>

            <div>
              <label htmlFor="register-confirm-password" className="mb-2 block text-sm font-medium text-[#E0E0E0]">Confirm password</label>
              <input
                id="register-confirm-password"
                name="confirmPassword"
                type="password"
                autoComplete="new-password"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Repeat your password"
                minLength="8"
                required
                className="w-full rounded-lg border border-[#454949] bg-[#100E12] px-4 py-3 text-sm text-[#E0E0E0] outline-none transition placeholder:text-[#777d7d] focus:border-[#1FB8CD] focus:ring-2 focus:ring-[#1FB8CD]/20"
              />
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
