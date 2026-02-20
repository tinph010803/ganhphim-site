"use client"

import {useSearchParams} from "next/navigation";
import {showToast} from "@/utils/helpers";
import {useEffect, useRef, useState} from "react";
import {Spinner} from "react-bootstrap";
import {useAppSelector} from "@/hooks/redux";
import UserApi from "@/api/user.api";
import {userAvatar} from "@/utils/image";

const LoginTV = () => {
    const codeLength = 6
    const searchParams = useSearchParams()
    const {loggedUser, isLoadingUserInfo} = useAppSelector(state => state.auth)
    const [loading, setLoading] = useState(false)
    const [code, setCode] = useState("")
    const [isSuccess, setIsSuccess] = useState(false)
    const [error, setError] = useState("")

    const [values, setValues] = useState(Array(codeLength).fill(""));
    const inputsRef = useRef([]);

    useEffect(() => {
        if (searchParams.get("code")) {
            fillCode(searchParams.get("code"))
        }
    }, []);

    useEffect(() => {
        if (values.every((val) => val !== "")) {
            setCode(values.join(""))
        } else {
            setCode("")
        }
    }, [values]);

    const submitCode = async () => {
        if (!loggedUser) {
            showToast({message: "Bạn phải đăng nhập để sử dụng tính năng này.", type: "error"})
            return
        }
        if (!loading) {
            setLoading(true)

            const {status, msg, result} = await UserApi.loginTV({code})
            setLoading(false)

            if (status) {
                setIsSuccess(true)
            } else {
                setError(`Mã không chính xác. Vui lòng thử lại.`)
                setValues(Array(codeLength).fill(""))
                inputsRef.current[0]?.focus()
            }
        }
    }

    const handleChange = (index, value) => {
        setError("")
        const newValues = [...values];
        newValues[index] = value;
        setValues(newValues);
        // Focus to the next input
        if (index < codeLength - 1) {
            inputsRef.current[index + 1]?.focus();
        }
    };

    const handleKeyDown = (index, e) => {
        if (e.key === "Backspace") {
            e.preventDefault();
            const newValues = [...values];
            newValues[index] = "";
            setValues(newValues);

            if (index > 0) {
                inputsRef.current[index - 1]?.focus();
            }
        }
    };

    const fillCode = (code) => {
        const newValues = Array(codeLength).fill("");
        for (let i = 0; i < code.length; i++) {
            if (/^\d$/.test(code[i])) {
                newValues[i] = code[i];
            }
        }
        setValues(newValues);
        const filledLength = code.length;
        if (filledLength < codeLength) {
            inputsRef.current[filledLength]?.focus();
        } else {
            inputsRef.current[codeLength - 1]?.focus();
        }
    }

    const handlePaste = (e) => {
        e.preventDefault();
        const pasteData = e.clipboardData.getData("text").slice(0, codeLength);
        fillCode(pasteData)
    };

    const handleFocus = (index) => {
        inputsRef.current[index].select();
    };

    return (
        <div className="fluid-gap">
            {!isSuccess && <div className="cards-row fixed code-page">
                {loggedUser && <div className="your-account">
                    <div className="line-center gap-2">
                        <div className="user-avatar"><img src={userAvatar(loggedUser)}/></div>
                        <strong>{loggedUser.name}</strong>
                    </div>
                </div>}
                <div className="row-header">
                    <h3 className="category-name w-100 text-center">Nhập mã được hiển thị trên TV của bạn</h3>
                </div>
                <div className="row-content">
                    <div className="login-code-box">
                        <div className="display-pin">
                            <div className={`login-code ${error ? "error" : ""}`}>
                                {values.map((val, index) => (
                                    <input type="tel" className="form-control" maxLength={1} key={index}
                                           autoFocus={index === 0}
                                           ref={(el) => (inputsRef.current[index] = el)} value={val}
                                           onChange={(e) => handleChange(index, e.target.value)}
                                           onKeyDown={(e) => handleKeyDown(index, e)}
                                           onFocus={() => handleFocus(index)}
                                           onPaste={handlePaste}/>
                                ))}
                            </div>
                            {error && <div className="text-danger text-center">{error}</div>}
                        </div>
                        <div className="buttons">
                            {!code && <button disabled type="button" className="btn btn-lg btn-light">
                                Nhập mã để tiếp tục
                            </button>}
                            {code && <button className="btn btn-lg btn-primary" onClick={submitCode}>
                                <div className="line-center">
                                    <span>Tiếp tục</span>
                                    <i className="fa-solid fa-arrow-right"></i>
                                    {loading && <Spinner
                                        className="ms-2"
                                        as="span"
                                        animation="border"
                                        size="sm"
                                        role="status"
                                        aria-hidden="true"
                                    />}
                                </div>
                            </button>}
                        </div>
                    </div>
                </div>
            </div>}
            {isSuccess && (
                <div className="cards-row fixed code-page">
                    <div className="tv-checked text-center">
                        <img src="/images/tv-checked.svg"/>
                    </div>
                    <div className="row-header">
                        <h3 className="category-name w-100 text-center">Đã đăng nhập thành công trên TV của bạn</h3>
                    </div>
                    <div className="your-account mt-3">
                        <div className="line-center gap-2">
                            <div className="user-avatar"><img src={userAvatar(loggedUser)}/></div>
                            <strong>{loggedUser.name}</strong>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default LoginTV