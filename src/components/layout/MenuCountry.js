import CustomLink from "@/components/shared/CustomLink";
import {Dropdown} from "react-bootstrap";
import {forwardRef, useState} from "react";
import {useAppSelector} from "@/hooks/redux";
import {countryUrl} from "@/utils/url";

const CustomToggle = forwardRef(({children, onClick}, ref) => {
  return (
    <a ref={ref} onClick={onClick}>
      {children}
      <i className="fa-solid fa-caret-down ms-2"></i>
    </a>
  )
})

const MenuCountry = () => {
  const [show, setShow] = useState(false)
  const {countries} = useAppSelector(state => state.app)

  return (
    <div className="menu-item menu-item-sub">
      <Dropdown className="season-dropdown" show={show} onToggle={() => setShow(!show)}>
        <Dropdown.Toggle as={CustomToggle}>
          Quốc gia
        </Dropdown.Toggle>
        <Dropdown.Menu className="v-dropdown-menu main_menu-dropdown bg-dark mt-2">
          {countries?.map(item => {
            return (
              <CustomLink key={`m-c-${item._id}`} href={countryUrl(item)} className="dropdown-item" onClick={() => setShow(false)}>{item.name}</CustomLink>
            )
          })}
        </Dropdown.Menu>
      </Dropdown>
    </div>
  )
}

export default MenuCountry