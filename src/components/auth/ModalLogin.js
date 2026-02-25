"use client"

import {Modal, Spinner} from "react-bootstrap";
import {useForm} from "react-hook-form";
import {useAppDispatch, useAppSelector} from "@/hooks/redux";
import {
  setLoggedUser,
  toggleShowModalForgotPassword,
  toggleShowModalLogin,
  toggleShowModalRegister
} from "@/redux/features/authSlice";
import AuthApi from "@/api/auth.api";
import {memo, useRef, useState} from "react";
import {showToast} from "@/utils/helpers";
import {Turnstile} from '@marsidev/react-turnstile'


const ModalLogin = () => {
  const {showModalLogin} = useAppSelector(state => state.auth)
  const [loginLoading, setLoginLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [btnShowPassword, setBtnShowPassword] = useState(false)
  const recaptchaLoginRef = useRef(null)
  const dispatch = useAppDispatch()
  const {register: formLogin, handleSubmit: handleSubmitLogin} = useForm()

  const onLoginSubmit = async (data) => {
    if (!loginLoading) {
      const captchaEnabled = !!process.env.TURNSTILE_SITE_KEY
      const captchaToken = recaptchaLoginRef.current?.getResponse() || ''
      if (captchaEnabled && captchaToken.length === 0) {
        showToast({message: `Hãy xác nhận bạn không phải là người máy`, type: "error"})
      } else {
        if (captchaToken) data.captchaToken = captchaToken
        setLoginLoading(true)

        try {
          const res = await AuthApi.login(data)
          setLoginLoading(false)

          const user = res?.data?.user || res?.result?.user
          const msg = res?.message || res?.msg

          if (!res?.status) {
            showToast({message: msg || "Đăng nhập thất bại", type: "error"})
            recaptchaLoginRef.current?.reset()
          } else {
            showToast({message: msg, type: 'success'})
            dispatch(toggleShowModalLogin())
            dispatch(setLoggedUser(user))
          }
        } catch (err) {
          setLoginLoading(false)
          const msg = err?.response?.data?.message
            || err?.response?.data?.msg
            || err?.message
            || "Tên đăng nhập hoặc mật khẩu không đúng"
          showToast({message: msg, type: "error"})
          recaptchaLoginRef.current?.reset()
        }
      }
    }
  }

  const passwordOnKeyUp = async (e) => {
    // console.log(e.target.value)
    setBtnShowPassword(e.target.value)
  }

  return (
    <Modal className="v-modal modal-login" centered={true} show={showModalLogin}
           onHide={() => dispatch(toggleShowModalLogin())}>
      <button className="btn modal-close" aria-label="Close" onClick={() => dispatch(toggleShowModalLogin())}>
        <i className="fa-solid fa-times"></i>
      </button>
      <div className="is-header mb-3">
        <h4 className="heading-sm mb-0 ">Đăng nhập</h4>
      </div>
      <div className="is-body">
        <p className="mb-4">
          Nếu bạn chưa có tài khoản, <a className="text-primary" onClick={() => dispatch(toggleShowModalRegister())}>đăng
          ký ngay</a>
        </p>
          <form className="v-form" onSubmit={handleSubmitLogin(onLoginSubmit)}>
              <div className="form-group mb-2">
                  <input type="text" className="form-control v-form-control"
                         placeholder="Tên đăng nhập" {...formLogin('username', {required: true})}/>
              </div>
              <div className={`form-group mb-4 user-password ${showPassword ? 'show-text' : ''}`}>
                  <input type={showPassword ? 'text' : 'password'} className="form-control v-form-control"
                         onKeyUp={passwordOnKeyUp}
                         placeholder="Mật khẩu" {...formLogin('password', {required: true})}/>
                  {btnShowPassword && <div className="toggle-password" onClick={() => setShowPassword(!showPassword)}><i
                      className="fa-solid fa-eye"></i></div>}
              </div>
              {process.env.TURNSTILE_SITE_KEY && <Turnstile
                  ref={recaptchaLoginRef}
                  siteKey={process.env.TURNSTILE_SITE_KEY}
                  onExpire={() => recaptchaLoginRef.current?.reset()}
                  onError={() => recaptchaLoginRef.current?.reset()}
                  options={{
                      language: "vi"
                  }}
              />}
              <div className="form-group action-btn mt-4 mb-4 d-grid">
                  <button className="btn d-block btn-primary">
                      Đăng nhập
                      {loginLoading && <Spinner
                          className="ms-2"
                          as="span"
                          animation="border"
                          size="sm"
                          role="status"
                          aria-hidden="true"
                      />}
                  </button>
              </div>
              <div className="form-opt text-center">
                  <a className="small" onClick={() => dispatch(toggleShowModalForgotPassword())}>Quên mật khẩu?</a>
              </div>
          </form>
      </div>
    </Modal>
  )
}

export default memo(ModalLogin)