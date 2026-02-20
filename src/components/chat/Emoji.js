"use client"

import {memo, forwardRef, useState, useEffect} from "react";
import {Dropdown, Nav, Tab} from "react-bootstrap";
import EmojiPicker from "emoji-picker-react";
import ChatGifTabContent from "@/components/chat/GifsTabContent";
import {useAppSelector} from "@/hooks/redux";

const CustomToggle = forwardRef(({children, onClick}, ref) => (
    <div className="emo-btn"
         ref={ref}
         onClick={(e) => {
             e.preventDefault();
             onClick(e);
         }}>
        {children}
    </div>
))

const CustomMenu = forwardRef(({className, onEmojiClick, onGifClick, setShowDropdown}, ref) => {
    const {loggedUser} = useAppSelector((s) => s.auth);

    return (
        <ul ref={ref} className={className} style={{bottom: "100%"}}>
            <Tab.Container defaultActiveKey="tabEmo">
                <Tab.Content>
                    <Tab.Pane eventKey="tabEmo">
                        <EmojiPicker theme="light" emojiStyle="native" onEmojiClick={(data) => onEmojiClick(data)}/>
                    </Tab.Pane>
                    {loggedUser?.is_vip && <Tab.Pane eventKey="tabGif">
                        <ChatGifTabContent onGifClick={onGifClick} setShowDropdown={setShowDropdown}/>
                    </Tab.Pane>}
                    {loggedUser?.is_vip && <Tab.Pane eventKey="tabSticker">
                        <ChatGifTabContent onGifClick={onGifClick} setShowDropdown={setShowDropdown} type="sticker"/>
                    </Tab.Pane>}
                </Tab.Content>
                <Nav variant="pills" className="v-tabs v-tabs-min tab-trans is-dark m-0">
                    <Nav.Item>
                        <Nav.Link eventKey="tabEmo">Emoji</Nav.Link>
                    </Nav.Item>
                    {loggedUser?.is_vip && <Nav.Item>
                        <Nav.Link eventKey="tabSticker">Sticker</Nav.Link>
                    </Nav.Item>}
                    {loggedUser?.is_vip && <Nav.Item>
                        <Nav.Link eventKey="tabGif">GIFs</Nav.Link>
                    </Nav.Item>}
                </Nav>
            </Tab.Container>
        </ul>
    )
})

const ChatEmoji = ({onEmojiClick, onGifClick}) => {
    const [showDropdown, setShowDropdown] = useState(false);

    return (
        <div className="emo">
            <Dropdown show={showDropdown} onToggle={(isOpen) => setShowDropdown(isOpen)}>
                <Dropdown.Toggle as={CustomToggle}>
                    <i className="fa-solid fa-laugh"></i>
                </Dropdown.Toggle>
                <Dropdown.Menu as={CustomMenu} className="v-dropdown-menu my-2 emo-stickers" onEmojiClick={onEmojiClick}
                               onGifClick={onGifClick} setShowDropdown={setShowDropdown}/>
            </Dropdown>
        </div>
    )
}

export default memo(ChatEmoji)