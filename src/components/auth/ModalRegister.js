"use client"

import {Modal, Spinner} from "react-bootstrap";
import {useAppDispatch, useAppSelector} from "@/hooks/redux";
import {
  setLoggedUser,
  toggleShowModalLogin,
  toggleShowModalRegister,
} from "@/redux/features/authSlice";
import AuthApi from "@/api/auth.api";
import {useState, useRef, memo} from "react";
import {useForm} from "react-hook-form";
import {showToast} from "@/utils/helpers";
import {Turnstile} from "@marsidev/react-turnstile";

const ModalRegister = () => {
  const {showModalRegister} = useAppSelector(state => state.auth)
  const dispatch = useAppDispatch()
  const [registerLoading, setRegisterLoading] = useState(false)
  const recaptchaRegisterRef = useRef(null)

  const {register: formRegister, handleSubmit: handleSubmitRegister} = useForm()

  const onRegisterSubmit = async (data) => {
    if (data.password !== data.cf_password) {
      showToast({message: `Xác nhận mật khẩu không chính xác.`, type: "error"})
      return
    }
    if (!registerLoading) {
      data.token = recaptchaRegisterRef.current.getResponse()
      if (data.token.length === 0) {
        showToast({message: `Hãy xác nhận bạn không phải là người máy`, type: "error"})
      } else {
        setRegisterLoading(true)

        const {status, msg, result, errors} = await AuthApi.register(data)
        setRegisterLoading(false)

        if (status) {
          showToast({message: msg, type: 'success'})
          dispatch(toggleShowModalRegister())
          dispatch(setLoggedUser(result.user))
        } else {
          if (errors) {
            for (const [key, error] of Object.entries(errors)) {
              showToast({message: error, type: "error"})
            }
          } else {
            showToast({message: msg, type: "error"})
          }
          recaptchaRegisterRef.current.reset()
        }
      }
    }
  }

  return (
    <Modal className="v-modal modal-login" centered={true} show={showModalRegister}
           onHide={() => dispatch(toggleShowModalRegister())}>
      <button className="btn modal-close" aria-label="Close" onClick={() => dispatch(toggleShowModalRegister())}>
        <i className="fa-solid fa-times"></i>
      </button>
      <div className="is-header mb-3">
        <h4 className="heading-sm mb-0 ">Tạo tài khoản mới</h4>
      </div>
      <div className="is-body">
        <p className="mb-4">
          Nếu bạn đã có tài khoản, <a className="text-primary" onClick={() => dispatch(toggleShowModalLogin())}>đăng
          nhập</a>
        </p>
        <form className="v-form" onSubmit={handleSubmitRegister(onRegisterSubmit)}>
          <div className="form-group mb-2">
            <input type="text" className="form-control v-form-control"
                   placeholder="Tên hiển thị" {...formRegister('name', {required: true})}/>
          </div>
          <div className="form-group mb-2">
            <input type="email" className="form-control v-form-control"
                   placeholder="Email" {...formRegister('email', {required: true})}/>
          </div>
          <div className="form-group mb-2">
            <input type="password" className="form-control v-form-control"
                   placeholder="Mật khẩu" {...formRegister('password', {required: true, minLength: 6})} minLength={6}/>
          </div>
          <div className="form-group mb-4">
            <input type="password" className="form-control v-form-control"
                   placeholder="Nhập lại mật khẩu" {...formRegister('cf_password', {required: true, minLength: 6})}
                   minLength={6}/>
          </div>
          <Turnstile
            ref={recaptchaRegisterRef}
            siteKey={process.env.TURNSTILE_SITE_KEY}
            onExpire={() => recaptchaRegisterRef.current?.reset()}
            onError={() => recaptchaRegisterRef.current?.reset()}
          />
          <div className="form-group action-btn mt-4 mb-4 d-grid">
            <button className="btn d-block btn-primary">
              Đăng ký
              {registerLoading && <Spinner
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

export default memo(ModalRegister)