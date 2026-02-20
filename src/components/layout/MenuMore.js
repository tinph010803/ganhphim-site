import CustomLink from "@/components/shared/CustomLink";
import {Dropdown} from "react-bootstrap";
import {forwardRef, useState} from "react";

const CustomToggle = forwardRef(({children, onClick}, ref) => {
    return (
        <a ref={ref} onClick={onClick}>
            {children}
            <i className="fa-solid fa-caret-down ms-2"></i>
        </a>
    )
})

const MenuMore = () => {
    const [show, setShow] = useState(false)

    return (
        <div className="menu-item menu-item-sub">
            <Dropdown className="season-dropdown" show={show} onToggle={() => setShow(!show)}>
                <Dropdown.Toggle as={CustomToggle}>
                    Thêm
                </Dropdown.Toggle>
                <Dropdown.Menu className="v-dropdown-menu main_menu-dropdown bg-dark mt-2">
                    <CustomLink href="/lich-chieu" className="dropdown-item" onClick={() => setShow(false)}>
                        Lịch chiếu
                    </CustomLink>
                    <CustomLink href="/chu-de" className="dropdown-item" onClick={() => setShow(false)}>
                        Chủ đề
                    </CustomLink>
                    <CustomLink href="/dien-vien" className="dropdown-item" onClick={() => setShow(false)}>
                        Diễn viên
                    </CustomLink>
                </Dropdown.Menu>
            </Dropdown>
        </div>
    )
}

export default MenuMore