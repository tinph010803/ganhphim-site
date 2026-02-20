"use client"

import {useRouter, useSearchParams} from "next/navigation";
import {useForm} from "react-hook-form";
import AuthApi from "@/api/auth.api";
import {showToast} from "@/utils/helpers";
import {useEffect, useState} from "react";
import {Alert, Spinner} from "react-bootstrap";
import {toggleShowModalLogin} from "@/redux/features/authSlice";
import {useAppDispatch, useAppSelector} from "@/hooks/redux";

const SetNewPassword = () => {
  const searchParams = useSearchParams()
  const dispatch = useAppDispatch()
  const router = useRouter()
  const {loggedUser, isLoadingUserInfo} = useAppSelector(state => state.auth)
  const [loading, setLoading] = useState(false)
  const [state, setState] = useState(null)
  const {register: formSetNewPassword, handleSubmit: handleSubmitSetNewPassword} = useForm()

  useEffect(() => {
    const verifyToken = async () => {
      const {status} = await AuthApi.verifyToken(searchParams.get("token"))
      if (status) {
        setState("tokenValid")
      } else {
        setState("tokenInvalid")
      }
    }

    verifyToken()
  }, []);

  useEffect(() => {
    if (loggedUser && !isLoadingUserInfo) {
      router.push("/phimhay")
    }
  }, [loggedUser, isLoadingUserInfo]);

  const onSetNewPasswordSubmit = async (data) => {
    data.token = searchParams.get("token")
    if (data.password !== data.cf_password) {
      showToast({message: 'Xác nhận mật khẩu không đúng', type: "error"})
      return
    }
    if (!loading) {

      setLoading(true)

      const {status, msg, result} = await AuthApi.setNewPassword(data)
      setLoading(false)

      if (status) {
        showToast({message: msg, type: 'success'})
        setState("success")
      } else {
        showToast({message: msg, type: "error"})
      }
    }
  }

  if (loggedUser === null && !isLoadingUserInfo)
    return (
      <div className="fluid-gap">
        <div className="cards-row fixed contact-page">
          <div className="row-header">
            <h3 className="category-name w-100 text-center">Thiết lập lại mật khẩu</h3>
          </div>
          <div className="row-content">
            <div className="contact-body">
              {state === "tokenValid" &&
                <form className="v-form" onSubmit={handleSubmitSetNewPassword(onSetNewPasswordSubmit)}>
                  <div className="form-group mb-2">
                    <input type="password" className="form-control v-form-control" minLength={6}
                           placeholder="Mật khẩu mới" {...formSetNewPassword('password', {
                      required: true,
                      minLength: 6
                    })}/>
                  </div>
                  <div className="form-group mb-2">
                    <input type="password" className="form-control v-form-control" minLength={6}
                           placeholder="Xác nhận mật khẩu mới" {...formSetNewPassword('cf_password', {
                      required: true,
                      minLength: 6
                    })}/>
                  </div>
                  <div className="form-group action-btn mt-5">
                    <button className="btn d-block btn-primary">
                      Hoàn thành
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
                </form>}
              {state === "tokenInvalid" && (<Alert variant={`danger`}>Token không tồn tại hoặc đã hết hạn.</Alert>)}
              {state === "success" && (<Alert variant={`success`}>
                <p>Thiết lập mật khẩu mới thành công.</p>
                <p> Nhấn <Alert.Link href="" onClick={() => dispatch(toggleShowModalLogin())}>đăng nhập</Alert.Link> để
                  tiếp tục.</p>
              </Alert>)}
            </div>
          </div>
        </div>
      </div>
    )
}

export default SetNewPassword