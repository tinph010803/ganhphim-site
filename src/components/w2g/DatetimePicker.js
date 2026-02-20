"use client";

import {useState, useEffect} from "react";
import DateTimePicker from "react-datetime-picker";
import "react-datetime-picker/dist/DateTimePicker.css";
import "react-calendar/dist/Calendar.css";
import "react-clock/dist/Clock.css";

const W2gDateTimePicker = ({onChange}) => {
    const currentDate = new Date()
    const computeMin = () => new Date(Date.now() + 30 * 60 * 1000)
    const computeMax = () => new Date(Date.now() + 15 * 24 * 60 * 60 * 1000)

    const [value, setValue] = useState(currentDate);
    const [minDate, setMinDate] = useState(computeMin())
    const [maxDate, setMaxDate] = useState(computeMax())

    // mỗi phút cập nhật lại minDate để luôn là now+10p
    useEffect(() => {
        const id = setInterval(() => {
            setMinDate(computeMin())
        }, 60 * 1000)
        return () => clearInterval(id)
    }, [])

    const handleChange = (newValue) => {
        setValue(newValue);
        onChange?.(newValue.getTime());
    };

    return (
        <div className="w2g-datetime-picker">
            <DateTimePicker
                onChange={handleChange}
                value={value}
                minDate={minDate}
                maxDate={maxDate}
                format="dd-MM-y HH:mm"
                disableClock={true}
                clearIcon={null}
                locale="vi-VN"
            />
        </div>
    );
};

export default W2gDateTimePicker;
