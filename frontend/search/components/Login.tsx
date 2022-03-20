import {useEffect} from 'react'

import {useLoginQuery} from '../codegen/generates'
import create from 'zustand'
import {useTranslation} from 'react-i18next';
import AvatarMenu from "./user/AvatarMenu";
import * as React from "react";
import {Box, Button} from "@mui/material";
import {AlternateEmail, Key} from "@mui/icons-material";
import ToolbarStyledInput from "./user/ToolbarStyledInput";

function jwtDecode(jwt: string) {
  /* Just parses the payload — Be aware that signature is not checked */
  return jwt && JSON.parse(atob(jwt.split('.')[1]))
}

export interface AuthState {
  mail: string,
  password: string,
  setLogin: (mail: string, password: string) => void
  jwt: string,
  setJwt: (jwt: string) => void,
  logout: () => void
}

export const useAuthStore = create<AuthState>(set => ({
  mail: '',
  password: '',
  setLogin: (mail, password) => set(_orig => ({mail, password})),
  jwt: '',
  setJwt: jwt => set(_orig => ({jwt})),
  logout: () => {
    localStorage.removeItem('jwt')
    set({mail: '', password: '', jwt: ''})
  }
}))

export function jwtFromLocalStorage() {
  return localStorage.getItem('jwt') || ''
}


export function Login() {
  const {t} = useTranslation()
  const {jwt, mail, password, logout, setJwt, setLogin} = useAuthStore()

  const {data} = useLoginQuery({auth: {jwt, mail, password}}, {enabled: Boolean(!jwt && mail && password)})

  useEffect(() => {
    if (jwt) {
      localStorage.setItem('jwt', jwt)
    } else {
      setJwt(data?.login.jwt || jwtFromLocalStorage())
    }

    if (jwtDecode(jwt).exp < Date.now() / 1000) {
      console.log('session expired')
      logout()
    }
  }, [logout, setJwt, jwt, data])

  return (
    <div style={{minHeight: '2em', display: 'flex'}}>
      {(!jwt)
        ? (
          <Box component={'form'} onSubmit={(event: React.FormEvent<HTMLDivElement>) => {
            event.preventDefault()
            setLogin((document.getElementById('mail') as HTMLInputElement).value,
              (document.getElementById('password') as HTMLInputElement).value)
          }} display={'flex'}>
            <ToolbarStyledInput icon={<AlternateEmail/>} id='mail' name='mail' placeholder={t('mail')}/>
            <ToolbarStyledInput icon={<Key/>} id='password' type='password' name='password'
                                placeholder={t('password')}/>
            <Button color={'inherit'} type='submit'>{t('Login')}</Button>

            {data?.login && !data?.login?.jwt && <p>{t('The login failed, please try again.')}</p>}
          </Box>)
        : (
          <AvatarMenu onLogout={logout}/>
        )}
    </div>)
}
