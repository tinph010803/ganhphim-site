"use client"

import UserSidebarMenu from "@/components/user/SidebarMenu";
import {useAppDispatch, useAppSelector} from "@/hooks/redux";
import {memo, useEffect, useState} from "react";
import {useRouter} from "next/navigation";
import {homeUrl} from "@/utils/url";
import AuthApi from "@/api/auth.api";
import {setLoggedUser} from "@/redux/features/authSlice";
import {showToast} from "@/utils/helpers";
import {Spinner} from "react-bootstrap";
import {useForm} from "react-hook-form";

const UserProfilePage = () => {
    const router = useRouter()
    const dispatch = useAppDispatch()
    const {loggedUser, isLoadingUserInfo} = useAppSelector(state => state.auth)

    const [saving, setSaving] = useState(false)
    const [changingPass, setChangingPass] = useState(false)

    const {register: regProfile, handleSubmit: handleProfile, reset: resetProfile} = useForm()
    const {register: regPass, handleSubmit: handlePass, reset: resetPass} = useForm()

    useEffect(() => {
        if (loggedUser === null && !isLoadingUserInfo) {
            router.push(homeUrl())
        }
    }, [loggedUser, isLoadingUserInfo])

    useEffect(() => {
        if (loggedUser) {
            resetProfile({
                displayName: loggedUser.displayName || loggedUser.name || '',
                avatar: loggedUser.avatar || '',
                gender: loggedUser.gender || '',
            })
        }
    }, [loggedUser])

    const onSaveProfile = async (data) => {
        if (saving) return
        setSaving(true)
        const res = await AuthApi.updateProfile(data)
        setSaving(false)
        const msg = res?.message || res?.msg
        if (res?.status) {
            const user = res?.data || res?.result
            if (user) dispatch(setLoggedUser(user))
            showToast({message: msg || 'Cập nhật thành công', type: 'success'})
        } else {
            showToast({message: msg || 'Cập nhật thất bại', type: 'error'})
        }
    }

    const onChangePassword = async (data) => {
        if (changingPass) return
        if (data.newPassword !== data.confirmPassword) {
            showToast({message: 'Mật khẩu xác nhận không khớp', type: 'error'})
            return
        }
        setChangingPass(true)
        const res = await AuthApi.changePassword({
            currentPassword: data.currentPassword,
            newPassword: data.newPassword,
        })
        setChangingPass(false)
        const msg = res?.message || res?.msg
        if (res?.status) {
            showToast({message: msg || 'Đổi mật khẩu thành công', type: 'success'})
            resetPass()
        } else {
            showToast({message: msg || 'Đổi mật khẩu thất bại', type: 'error'})
        }
    }

    return (
        <div id="wrapper" className="account-wrap">
            {(loggedUser && !isLoadingUserInfo) && (
                <div className="dashboard-container">
                    <UserSidebarMenu loggedUser={loggedUser} page="profile"/>
                    <div className="dcc-main">
                        <div className="cg-body-box">
                            <div className="box-header">
                                <div className="heading-sm mb-0">Thông tin tài khoản</div>
                            </div>
                            <div className="box-body">
                                <form className="v-form" onSubmit={handleProfile(onSaveProfile)}>
                                    <div className="row g-3">
                                        <div className="col-12">
                                            <label className="form-label">Email</label>
                                            <input
                                                type="text"
                                                className="form-control v-form-control"
                                                value={loggedUser.email || ''}
                                                disabled
                                                readOnly
                                            />
                                        </div>
                                        <div className="col-12">
                                            <label className="form-label">Tên đăng nhập</label>
                                            <input
                                                type="text"
                                                className="form-control v-form-control"
                                                value={loggedUser.username || ''}
                                                disabled
                                                readOnly
                                            />
                                        </div>
                                        <div className="col-12">
                                            <label className="form-label">Tên hiển thị</label>
                                            <input
                                                type="text"
                                                className="form-control v-form-control"
                                                placeholder="Tên hiển thị"
                                                {...regProfile('displayName', {maxLength: 50})}
                                            />
                                        </div>
                                        <div className="col-12">
                                            <label className="form-label">Avatar URL</label>
                                            <input
                                                type="text"
                                                className="form-control v-form-control"
                                                placeholder="https://..."
                                                {...regProfile('avatar')}
                                            />
                                        </div>
                                        <div className="col-12">
                                            <label className="form-label">Giới tính</label>
                                            <select className="form-control v-form-control" {...regProfile('gender')}>
                                                <option value="">-- Chọn --</option>
                                                <option value="male">Nam</option>
                                                <option value="female">Nữ</option>
                                                <option value="other">Khác</option>
                                            </select>
                                        </div>
                                        <div className="col-12">
                                            <button className="btn btn-primary" type="submit" disabled={saving}>
                                                Lưu thông tin
                                                {saving && <Spinner as="span" animation="border" size="sm" className="ms-2"/>}
                                            </button>
                                        </div>
                                    </div>
                                </form>

                                <hr className="my-4"/>
                                <div className="heading-sm mb-3">Đổi mật khẩu</div>
                                <form className="v-form" onSubmit={handlePass(onChangePassword)}>
                                    <div className="row g-3">
                                        <div className="col-12">
                                            <label className="form-label">Mật khẩu hiện tại</label>
                                            <input
                                                type="password"
                                                className="form-control v-form-control"
                                                placeholder="Mật khẩu hiện tại"
                                                {...regPass('currentPassword', {required: true})}
                                            />
                                        </div>
                                        <div className="col-12">
                                            <label className="form-label">Mật khẩu mới</label>
                                            <input
                                                type="password"
                                                className="form-control v-form-control"
                                                placeholder="Mật khẩu mới (tối thiểu 6 ký tự)"
                                                {...regPass('newPassword', {required: true, minLength: 6})}
                                            />
                                        </div>
                                        <div className="col-12">
                                            <label className="form-label">Xác nhận mật khẩu mới</label>
                                            <input
                                                type="password"
                                                className="form-control v-form-control"
                                                placeholder="Nhập lại mật khẩu mới"
                                                {...regPass('confirmPassword', {required: true})}
                                            />
                                        </div>
                                        <div className="col-12">
                                            <button className="btn btn-primary" type="submit" disabled={changingPass}>
                                                Đổi mật khẩu
                                                {changingPass && <Spinner as="span" animation="border" size="sm" className="ms-2"/>}
                                            </button>
                                        </div>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default memo(UserProfilePage)
