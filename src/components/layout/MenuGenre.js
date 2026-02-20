import CustomLink from "@/components/shared/CustomLink";
import {Dropdown} from "react-bootstrap";
import {forwardRef, useState} from "react";
import {useAppSelector} from "@/hooks/redux";
import {genreUrl} from "@/utils/url";

const CustomToggle = forwardRef(({children, onClick}, ref) => {
    return (
        <a ref={ref} onClick={onClick}>
            {children}
            <i className="fa-solid fa-caret-down ms-2"></i>
        </a>
    )
})

const MenuGenre = () => {
    const [show, setShow] = useState(false)
    const {genres} = useAppSelector(state => state.app)

    return (
        <div className="menu-item menu-item-sub">
            <Dropdown className="season-dropdown" show={show} onToggle={() => setShow(!show)}>
                <Dropdown.Toggle as={CustomToggle}>
                    Thể loại
                </Dropdown.Toggle>
                <Dropdown.Menu className="v-dropdown-menu main_menu-dropdown bg-dark mt-2">
                    <div className="m-col-4">
                        {genres?.map(item => {
                            return (
                                <CustomLink key={`m-g-${item._id}`} href={genreUrl(item)} className="dropdown-item" title={item.name}
                                      onClick={() => setShow(false)}><span>{item.name}</span></CustomLink>
                            )
                        })}
                    </div>
                </Dropdown.Menu>
            </Dropdown>
        </div>
    )
}

export default MenuGenre