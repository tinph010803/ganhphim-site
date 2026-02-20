"use client"

import {Modal, Spinner} from "react-bootstrap";
import {useAppDispatch, useAppSelector} from "@/hooks/redux";
import {
  toggleShowModalForgotPassword,
  toggleShowModalLogin,
} from "@/redux/features/authSlice";
import {useRef, useState} from "react";
import {useForm} from "react-hook-form";
import AuthApi from "@/api/auth.api";
import {showToast} from "@/utils/helpers";
import {Turnstile} from "@marsidev/react-turnstile";

const ModalForgotPassword = () => {
  const {showModalForgotPassword} = useAppSelector(state => state.auth)
  const dispatch = useAppDispatch()
  const [loading, setLoading] = useState(false)
  const recaptchaRef = useRef(null)

  const {register: formForgotPassword, handleSubmit: handleSubmitForgot, reset: resetFormForgotPassword} = useForm()

  const onForgotSubmit = async (data) => {
    if (!loading) {
      data.token = recaptchaRef.current.getResponse()
      if (data.token.length === 0) {
        showToast({message: `Hãy xác nhận bạn không phải là người máy`, type: "error"})
      } else {
        setLoading(true)

        const {status, msg, result} = await AuthApi.forgotPassword(data)
        setLoading(false)

        if (status) {
          showToast({message: msg, type: 'success'})
          dispatch(toggleShowModalForgotPassword())
          resetFormForgotPassword()
        } else {
          showToast({message: msg, type: "error"})
        }

        recaptchaRef.current.reset()
      }
    }
  }

  return (
    <Modal className="v-modal modal-login" centered={true} show={showModalForgotPassword}
           onHide={() => toggleShowModalForgotPassword()}>
      <button className="btn modal-close" aria-label="Close" onClick={() => dispatch(toggleShowModalForgotPassword())}>
        <i className="fa-solid fa-times"></i>
      </button>
      <div className="is-header mb-3">
        <h4 className="heading-sm mb-0 ">Quên mật khẩu</h4>
      </div>
      <div className="is-body">
        <p className="mb-4">Nếu bạn đã có tài khoản, <a className="text-primary"
                                                        onClick={() => dispatch(toggleShowModalLogin())}>đăng
          nhập</a></p>
        <form className="v-form" onSubmit={handleSubmitForgot(onForgotSubmit)}>
          <div className="form-group mb-4">
            <input type="email" className="form-control v-form-control"
                   placeholder="Email đăng ký" {...formForgotPassword('email', {required: true})}/>
          </div>
          <Turnstile
            ref={recaptchaRef}
            siteKey={process.env.TURNSTILE_SITE_KEY}
            onExpire={() => recaptchaRef.current?.reset()}
            onError={() => recaptchaRef.current?.reset()}
          />
          <div className="form-group action-btn mt-4">
            <button className="btn d-block btn-primary">
              Gửi yêu cầu
              {loading && <Spinner
                className="ms-2"
                as="span"
                animation="border"
                size="sm"
                role="status"
                aria-hidden="true"
              />}
            </button>
          </div>
        </form>
      </div>
    </Modal>
  )
}

export default ModalForgotPassword