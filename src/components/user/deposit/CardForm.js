"use client"

import {memo, useState} from "react";
import {useForm} from "react-hook-form";
import {Alert, Spinner} from "react-bootstrap";
import PaymentApi from "@/api/payment.api";
import {useAppDispatch} from "@/hooks/redux";
import {setBillingId, setStatus} from "@/redux/features/paymentSlice";

const networks = [
    {code: "Mobi", name: "Mobiphone", image: "/images/networks/mobiphone.png", active: true},
    {code: "Vina", name: "Vinaphone", image: "/images/networks/vinaphone.png", active: true},
    {code: "VT", name: "Viettel", image: "/images/networks/viettel.png", active: false},
]

const DepositCardForm = ({_package}) => {
    const dispatch = useAppDispatch()

    const [selectedNetwork, setSelectedNetwork] = useState(networks[0])
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState("")
    const {register: cardForm, handleSubmit: handleSubmitCardForm} = useForm()

    const onSubmitCardForm = async (data) => {
        data.card_type = selectedNetwork.code
        data.package_id = _package.id

        if (!isLoading) {
            setError("")
            setIsLoading(true)
            const {status, result, msg} = await PaymentApi.submitCard(data)
            if (status) {
                dispatch(setStatus("processing"))
                dispatch(setBillingId(result.billing_id))
            } else {
                setError(msg)
            }
            setIsLoading(false)
        }
    }

    const handleNetworkClick = (net) => {
        setSelectedNetwork(net)
    }

    return (
        <div className="payment-gen effect-fade-in">
            <div className="pg-wrap">
                <div className="pg-title line-center gap-3">
                    <div className="inc-icon icon-20">
                        <img src="/images/phone.webp"/>
                    </div>
                    <span className="heading-xs m-0">Thanh toán bằng thẻ điện thoại</span>
                </div>
                <div className="pg-content">
                    <div className="net-input d-flex flex-column gap-3 my-4 w-100">
                        <div className="heading-xs mb-1">Chọn nhà mạng</div>
                        <div className="network-select mb-2">
                            {networks.map(item => {
                                return (
                                    <div
                                        className={`net-item ${item.code === selectedNetwork.code ? 'active' : ''}`}
                                        key={`network-${item.code}`}
                                        onClick={() => handleNetworkClick(item)}>
                                        <div className="net-icon">
                                            <img src={item.image}/>
                                        </div>
                                        <div className="name">{item.name}</div>
                                    </div>
                                )
                            })}
                        </div>
                        {error &&
                            <Alert variant="danger" className="mt-3 mb-3">{error}</Alert>}
                        {!selectedNetwork.active && <Alert variant="danger" className="mt-3 mb-3">Thanh toán bằng
                            thẻ {selectedNetwork.name} đang bảo trì. Vui lòng thử lại sau!</Alert>}
                        <form className="v-form flex-grow-1" onSubmit={handleSubmitCardForm(onSubmitCardForm)}>
                            <div className="form-group mb-3">
                                <input type="text" disabled={!selectedNetwork?.active}
                                       className="form-control form-control-lg v-form-control"
                                       placeholder="Mã thẻ" {...cardForm('card_code', {
                                    required: true,
                                })} required/>
                            </div>
                            <div className="form-group mb-4">
                                <input type="text" disabled={!selectedNetwork?.active}
                                       className="form-control form-control-lg v-form-control"
                                       placeholder="Seri thẻ" {...cardForm('card_seri', {
                                    required: true,
                                })} required/>
                            </div>
                            <div className="buttons">
                                <button className="btn btn-lg w-100 btn-primary">
                                    Gửi
                                    {isLoading && <Spinner
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
                </div>
            </div>
        </div>
    )
}

export default memo(DepositCardForm)