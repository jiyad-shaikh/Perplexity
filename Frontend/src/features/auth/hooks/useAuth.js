import { useDispatch } from 'react-redux'
import { registerUser, loginUser, logoutUser, getMe } from '../services/auth.services.js'
import { setUser, setLoading, setError } from '../auth.slice.js'

export function useAuth() {
    const dispatch = useDispatch()

    async function handleRegister(name, email, password) {
        try {
            dispatch(setLoading(true))
            const data = await registerUser(name, email, password)
            } 
        catch (error) {
            dispatch(setError(error))
        } finally {
            dispatch(setLoading(false))
        }
    }

    async function handleLogin(payload) {
    try {
        dispatch(setLoading(true));

        const data = await loginUser(
            payload.email,
            payload.password
        );

        dispatch(setUser(data.user));

        return data;
    } catch (error) {
        dispatch(setError(error));
        throw error;
    } finally {
        dispatch(setLoading(false));
    }
}

    async function handleGetMe() {
        try {
            dispatch(setLoading(true))
            const data = await getMe()
            dispatch(setUser(data.user))
        } 
        catch (error) {
            dispatch(setError(error))
        } finally {
            dispatch(setLoading(false))
        }
    }

    async function handleLogout() {
        try {
            dispatch(setLoading(true))
            await logoutUser()
            dispatch(setUser(null))
        } 
        catch (error) {
            dispatch(setError(error))
        } finally {
            dispatch(setLoading(false))
        }
    }

    return { handleRegister, handleLogin, handleGetMe, handleLogout }
}
